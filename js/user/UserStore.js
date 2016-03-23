/**
 * UserStore.js
 * @author albert
 * @author kevin
 * @flow
 */

'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var base64 = require('base-64');
var resizeImage = require('./../shared/helpers/resizeImage');
var Dispatcher = require('./../shared/dispatcher');
var constants = require('./../constants');
var USER = constants.USER;
var BEVY = constants.BEVY;
var BOARD = constants.BOARD;
var APP = constants.APP;
var CHAT = constants.CHAT;
var AppActions = require('./../app/AppActions');
var FileStore = require('./../file/FileStore');
var BevyActions = require('./../bevy/BevyActions');
var BevyStore = require('./../bevy/BevyStore');
var GCM = require('./../shared/apis/GCM.android.js');

var React = require('react-native');
var {
  AsyncStorage,
  Platform,
  NativeAppEventEmitter,
  AlertIOS
} = React;
var DeviceInfo = require('react-native-device-info');
var GoogleSignIn = require('react-native-google-signin');

var User = require('./UserModel');
var Users = require('./UserCollection');

var UserStore = _.extend({}, Backbone.Events);
_.extend(UserStore, {

  loggedIn: false, // simple flag to see if user is logged in or not
  user: new User,
  userSearchQuery: '',
  userSearchResults: new Users,

  accessToken: '',
  refreshToken: '',
  expires_in: 0,
  tokensLoaded: false,

  handleDispatch(payload) {
    switch(payload.actionType) {
      case APP.LOAD:
        this.user.url = constants.apiurl + '/users/' + this.user.get('id');
        this.user.fetch({
          success: function(model, res, options) {
            this.setUser(res);
          }.bind(this)
        });
        break;

      case USER.FETCH:
        var user_id = payload.user_id;
        this.trigger(USER.LOADING);
        if(user_id) {
          // fetching another user
          fetch(constants.apiurl + '/users/' + user_id, {
            method: 'GET'
          })
          .then(res => res.json())
          .then(res => {
            this.trigger(USER.LOADED, res);
          });
        } else {
          // fetching self
          this.user.url = constants.apiurl + '/users/' + this.user.get('id');
          this.user.fetch({
            success: function(model, res, options) {
              this.setUser(res);
            }.bind(this)
          });
        }
        break;

      case USER.LOAD_USER:
        var user = payload.user;
        this.setUser(user);
        this.loggedIn = true;
        // check if auth tokens have been passed in from the server
        AsyncStorage.multiGet(['access_token', 'refresh_token', 'expires_in'])
        .then(response => {
          var access = response[0][1];
          var refresh = response[1][1];
          var expires = response[2][1];
          if(_.isEmpty(access) && _.isEmpty(refresh) && _.isEmpty(expires)) {
            this.trigger(USER.LOGOUT);
          }
          if(!_.isEmpty(access) && !_.isEmpty(refresh)) {
            // check if access token has expired
            if(new Date(expires).getTime() <= Date.now()) {
              this.refreshTokens();
            } else {
              this.setTokens(access, refresh, expires);
            }
          }
        });
        this.trigger(USER.LOADED, user);
        break;

      case USER.LOGIN:
        var username = payload.username;
        var password = payload.password;
        var bevySlug = payload.bevySlug;
        console.log('logging in');
        this.login(username, password, bevySlug);
        GoogleSignIn.signOut();
        break;

      case USER.LOGOUT:
        // remove google token
        AsyncStorage.removeItem('google_id');
        // remove user
        AsyncStorage.removeItem('user');

        this.user = new User;
        this.loggedIn = false;

        GoogleSignIn.signOut();

        this.trigger(USER.LOGOUT);
        break;

      case USER.REGISTER:
        var username = payload.username;
        var password = payload.password;
        var email = payload.email;

        fetch(constants.apiurl + '/users', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: username,
            password: password,
            email: email
          })
        })
        .then(res => res.json())
        .then(res => {
          var user = res;
          console.log('register success. logging in...');
          this.login(username, password);
        })
        .catch(error => {
          error = JSON.parse(error);
          console.error(error);
          this.trigger(USER.LOGIN_ERROR, error.message);
        })
        .done();

        break;

      case USER.RESET_PASSWORD:
        var email = payload.email;

        fetch(constants.siteurl + '/forgot', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email
          })
        })
        .then(res => res.json())
        .then(res => {
          this.trigger(USER.RESET_PASSWORD_SUCCESS);
        })
        .catch(error => {
          error = JSON.parse(error);
          console.error(error);
          this.trigger(USER.RESET_PASSWORD_ERROR, error.message);
        })
        .done();
        break;

      case USER.UPDATE:
        break;

      case USER.CHANGE_PROFILE_PICTURE:
        var file = payload.file;

        console.log(file);

        if(_.isEmpty(file)) {
          break;
        }

        this.user.save({
          image: file
        }, {
          patch: true,
          success: function(model, response, options) {
            //console.log(response);
          }.bind(this)
        });
        this.user.set('image', file);
        this.trigger(USER.CHANGE_ALL);
        break;

      case USER.VERIFY_USERNAME:
        var username = payload.username;
        var url = constants.apiurl + '/users/' +
          encodeURIComponent(username) + '/verify';

        fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then(res => res.json())
        .then(res => {
          this.trigger(USER.VERIFY_SUCCESS, res);
        });
        break;

      case USER.SEARCH:
        this.trigger(USER.SEARCHING);

        let query = payload.query;
        let bevy_id = payload.bevy_id;
        let role = payload.role;

        query = encodeURIComponent(query);

        let url = (_.isEmpty(query))
          ? constants.apiurl + '/users/search' + '?bevy_id=' + bevy_id + '&role=' + role
          : constants.apiurl + '/users/search/' + query + '?bevy_id=' + bevy_id + '&role=' + role;

        // if we're searching through admins, go through a totally different route
        if(role == 'admin') {
          let activeBevy = BevyStore.getActive();
          let admin_ids = activeBevy.admins;
          admin_ids = _.pluck(admin_ids, '_id');
          for(var key in admin_ids) {
            url += `&admin_ids[${key}]=${admin_ids[key]}`
          }
        }

        fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        })
        .then(res => res.json())
        .then(res => {
          this.userSearchQuery = query;
          this.userSearchResults.reset(res);
          this.trigger(USER.SEARCH_COMPLETE);
        })
        .catch(err => {
          this.trigger(USER.SEARCH_ERROR, err.toString());
        });
        break;

      case BOARD.JOIN:
        // add to users bevies array
        var board_id = payload.board_id;

        var boards = this.user.get('boards');
        if(_.contains(boards, board_id)) break; // already joined

        boards.push(board_id);
        _.uniq(boards); // ensure that theres no dupes

        this.user.url = constants.apiurl + '/users/' + this.user.id;

        this.user.save({
          boards: boards
        }, {
          patch: true,
          success: function(model, response, options) {
            console.log(model);
            this.trigger(USER.CHANGE_ALL);
          }.bind(this)
        });
        break;

      case BOARD.DESTROY:
      case BOARD.LEAVE:
        // remove from users bevies array
        var board_id = payload.board_id;

        var boards = this.user.get('boards');
        boards = _.reject(boards, function($board_id) {
          return $board_id == board_id;
        });
        _.uniq(boards); // ensure that theres no dupes

        this.user.url = constants.apiurl + '/users/' + this.user.id;

        this.user.save({
          boards: boards
        }, {
          patch: true,
          success: function(model, response, options) {
            //console.log(model);
            this.trigger(USER.CHANGE_ALL);
          }.bind(this)
        });
        break;
    }
  },

  onRegister(token) {
    console.log('GCM TOKEN', token);
    // check if we've already sent this token
    AsyncStorage.getItem('GCM_token')
    .then($token => {
      if($token && $token == token) {
        // it already exists and/or it matches, do nothing
        console.log('gcm token already exists. continuing...');
        return;
      } else {
        console.log('gcm token not found. registering...');
        // add to device list
        var new_device = this.user.devices.add({
          token: token,
          platform: 'android',
          uniqueID: DeviceInfo.getUniqueID(),
          manufacturer: DeviceInfo.getManufacturer(),
          model: DeviceInfo.getModel(),
          deviceID: DeviceInfo.getDeviceId(),
          name: DeviceInfo.getSystemName(),
          version: DeviceInfo.getSystemVersion(),
          bundleID: DeviceInfo.getBundleId(),
          buildNum: DeviceInfo.getBuildNumber(),
          appVersion: DeviceInfo.getVersion(),
          appVersionReadable: DeviceInfo.getReadableVersion()
        });
        console.log('saving', new_device.toJSON(), 'to ', new_device.url);
        // save to server
        new_device.save(null, {
          success: function(model, response, options) {
            console.log('device registration success');
            // save to local storage
            AsyncStorage.setItem('GCM_token', token);
          },
          error: function(error) {
            console.error('device registration error:', error);
          }
        });
      }
    });
  },

  getUser() {
    if(!this.loggedIn) return {};
    return this.user.toJSON();
  },

  getLinkedAccounts() {
    return this.linkedAccounts.toJSON();
  },

  getUserSearchQuery() {
    return this.userSearchQuery;
  },

  getUserSearchResults() {
    return this.userSearchResults.toJSON();
  },

  addBoard(board) {
    var boards = this.user.get('boards');
    boards.push(board._id);
    this.user.set('boards', boards);
    //this.setUser(this.user);
    this.trigger(USER.CHANGE_ALL);
  },

  login(username, password, bevySlug) {
    var login_url = 'http://' + bevySlug + '.' + constants.domain;
    fetch(login_url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        client_id: constants.client_id,
        client_secret: constants.client_secret,
        grant_type: 'password',
        username: username,
        password: password
      })
    })
    .then(res => res.json())
    .then(res => {
      if(typeof res === 'string') {
        console.log('login error', res);
        this.trigger(USER.LOGIN_ERROR, res);
        return;
      }
      console.log('login success');
      // set the new user
      this.setUser(res.user);
      // set the access and refresh tokens
      this.setTokens(
        res.accessToken,
        res.refreshToken,
        res.expires_in
      );
    })
    .catch(err => {
      console.log('login error', err);
      // trigger error and pass along error message
      if(err) err = err.toString();
      this.trigger(USER.LOGIN_ERROR, err);
    });
  },

  setUser(user) {
    this.user = new User(user);
    this.user.url = constants.apiurl + '/users/' + this.user.get('_id');
    this.loggedIn = true;
    AsyncStorage.setItem('user', JSON.stringify(user));
    // register push notifications for android
    // get token if it exists
    if(Platform.OS == 'android') {
      GCM.addEventListener('register', data => {
        this.onRegister(data.deviceToken);
      });
      GCM.register();
    }

    this.trigger(USER.LOADED, user);
  },

  getAccessToken() {
    return this.accessToken;
  },

  setTokens(accessToken, refreshToken, expires_in) {
    if(_.isEmpty(accessToken) || _.isEmpty(refreshToken)) {
      // if one of them is missing, then we need to clear all
      console.log('clearing oauth2 tokens');
      this.clearTokens();
      return;
    }
    // set locally
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expires_in = expires_in;

    // and save
    this.tokensLoaded = true;
    AsyncStorage.setItem('access_token', accessToken);
    AsyncStorage.setItem('refresh_token', refreshToken);
    console.log('tokens set!');
    expires_in = Date.now() + expires_in;
    AsyncStorage.setItem('expires_in', expires_in.toString());
    this.trigger(USER.TOKENS_LOADED);
  },

  refreshTokens() {
    console.log('refreshing tokens...');
    AsyncStorage.getItem('refresh_token', token => {
      if(!token) {
        this.trigger(USER.LOGIN_ERROR);
        return;
      }

      fetch(constants.siteurl + '/token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          client_id: constants.client_id,
          client_secret: constants.client_secret,
          grant_type: 'refresh_token',
          refresh_token: token
        })
      })
      .then(res => res.json())
      .then(res => {
        console.log('got new tokens! setting now...');
        var accessToken = res.access_token;
        var refreshToken = res.refresh_token;
        var expiresIn = res.expiresIn;
        this.clearTokens();
        this.setTokens(accessToken, refreshToken, expiresIn);
      });
    });
  },

  clearTokens() {
    AsyncStorage.removeItem('access_token');
    AsyncStorage.removeItem('refresh_token');
    AsyncStorage.removeItem('expires_in');
  },

  getUserImage(image, width, height) {
    var img_default = require('./../images/user-profile-icon.png');
    var source = { uri: ((_.isEmpty(image))
      ? ''
      : image.path) };
    if(source.uri == (constants.siteurl + '/img/user-profile-icon.png')) {
      source = img_default;
      return source;
    } else if(source.uri == '/img/user-profile-icon.png') {
      source = img_default;
      return source;
    } else if (_.isEmpty(source.uri)) {
      source = img_default;
      return source;
    }
    // if we're hosting the image, then its safe to pass resize url params
    if(!image.foreign) {
      source.uri = resizeImage(image, width, height).url;
    }
    return source;
  }
});

var dispatchToken = Dispatcher.register(UserStore.handleDispatch.bind(UserStore));
UserStore.dispatchToken = dispatchToken;

module.exports = UserStore;

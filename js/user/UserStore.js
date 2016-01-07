'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var Dispatcher = require('./../shared/dispatcher');
var constants = require('./../constants');
var USER = constants.USER;
var BEVY = constants.BEVY;
var APP = constants.APP;
var AppActions = require('./../app/AppActions');
var FileStore = require('./../file/FileStore');
var GCM = require('./../shared/apis/GCM.android.js');

var React = require('react-native');
var {
  AsyncStorage,
  Platform
} = React;
var DeviceInfo = require('react-native-device-info');

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
      case USER.LOAD_USER:
        var user = payload.user;
        if(_.isEmpty(user)) {
          this.loggedIn = false;
          break;
        } else {
          this.setUser(user);
          this.loggedIn = true;
        }
        // check if auth tokens have been passed in from the server
        AsyncStorage.multiGet(['access_token', 'refresh_token', 'expires_in'])
        .then((response) => {
            var access = response[0][1];
            var refresh = response[1][1];
            var expires = response[2][1];
            if(!_.isEmpty(access) && !_.isEmpty(refresh)) {
              this.setTokens(access, refresh, expires);
              this.trigger(USER.LOADED);
            }
          }
        );
        break;

      case USER.LOGIN:
        var username = payload.username;
        var password = payload.password;
        console.log('logging in');
        this.login(username, password);
        break;

      case USER.LOGIN_GOOGLE:
        var google_id = payload.google_id;

        fetch(constants.apiurl + '/users/google/' + google_id)
        .then((res) => res.json())
        .then((user) => {
          console.log('logged in google', user);

          AsyncStorage.setItem('user', JSON.stringify(user))
            .then((err, result) => {
            });

          this.setUser(user);
          this.trigger(USER.LOGIN_SUCCESS, user);
        });

        break;
      
      case USER.LOGOUT:
        // remove google token
        AsyncStorage.removeItem('google_id');
        // remove user
        AsyncStorage.removeItem('user');

        this.user = new User;
        this.loggedIn = false;

        this.trigger(USER.LOADED);
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
          this.setUser(user);
          AsyncStorage.setItem('user', JSON.stringify(user))
          .then((err, result) => {
          });
          this.trigger(USER.LOGIN_SUCCESS, user);
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
        var uri = payload.uri;
        var image = payload.image;

        console.log(uri);

        if(uri) {
          FileStore.upload(uri, (err, filename) => {
            console.log('USER STORE', err, filename);
            if(err) return;
            this.user.save({
              image_url: filename
            }, {
              patch: true,
              success: function(model, response, options) {
                //console.log(response);
              }.bind(this)
            });
            this.user.set('image_url', filename);
            this.trigger(USER.LOADED);
          });
        } else {
          this.user.save({
            image: image
          }, {
            patch: true,
            success: function(model, response, options) {
            }.bind(this)
          });
          this.user.set('image', image);
          this.trigger(USER.LOADED);
        }
        break;

      case USER.SWITCH_USER:
        var account_id = payload.account_id;
        var url = constants.siteurl + '/switch';

        fetch(url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: 'dummy',
            password: 'dummy',
            user_id: this.user.get('_id'),
            switch_to_id: account_id
          })
        })
        .then(res => res.json())
        .then(res => {
          console.log('switched');
          AsyncStorage.setItem('user', JSON.stringify(res))
          .then((err, result) => {
          });

          this.setUser(res);
          //this.trigger(USER.LOGIN_SUCCESS, res);
          AppActions.load();
        });
        break;

      case BEVY.SUBSCRIBE:
        var bevy_id = payload.bevy_id;
        var bevies = this.user.get('bevies');
        console.log(bevies);
        bevies = _.reject(bevies, function(bevy) {
          return bevy == null
        });


        if(_.find(bevies, function(bevy){ return bevy == bevy_id}) != undefined) break; // user is already subbed

        bevies.push(bevy_id);

        this.user.save({
          bevies: bevies
        }, {
          patch: true,
          success: function(model, response, options) {
            // update local storage user
            AsyncStorage.setItem('user', JSON.stringify(this.user.toJSON()));
            this.trigger(USER.LOADED);
          }.bind(this)
        });
        break;
      case BEVY.UNSUBSCRIBE:
        var bevy_id = payload.bevy_id;
        var bevies = this.user.get('bevies');
        console.log(bevies);
        bevies = _.reject(bevies, function(bevy) {
          return bevy == null
        });

        // save user to server
        this.user.save({
          bevies: bevies
        }, {
          patch: true,
          success: function(model, response, options) {
            // update local storage user
            AsyncStorage.setItem('user', JSON.stringify(this.user.toJSON()));

            this.trigger(USER.LOADED);
          }.bind(this)
        });
        break;

      case USER.LINK_ACCOUNT:
        var account = payload.account;

        var linkedAccounts = this.user.get('linkedAccounts');
        if(_.isEmpty(linkedAccounts)) linkedAccounts = [];

        linkedAccounts.push(account._id);
        _.uniq(linkedAccounts); // remove dupes

        /*$.ajax({
          url: constants.apiurl + '/users/' + this.user.get('_id') + '/linkedaccounts',
          method: 'POST',
          data: {
            account_id: account._id
          },
          success: function(data) {

          },
          error: function(error) {
            console.log(error);
          }
        });*/

        // add to collection
        this.linkedAccounts.push(account);
        this.trigger(USER.CHANGE_ALL);
        break;

      case USER.UNLINK_ACCOUNT:
        var account = payload.account;

        var linkedAccounts = this.user.get('linkedAccounts');
        if(_.isEmpty(linkedAccounts)) linkedAccounts = [];

        linkedAccounts = _.without(linkedAccounts, account._id);
        _.uniq(linkedAccounts); // remove dupes

        /*$.ajax({
          url: constants.apiurl + '/users/' + this.user.get('_id') + '/linkedaccounts/' + account._id,
          method: 'DELETE',
          success: function(data) {

          },
          error: function(error) {
            console.log(error);
          }
        });*/

        // remove from collection
        this.linkedAccounts.remove(account._id);
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
        var query = payload.query;
        // make the query url friendly
        query = encodeURIComponent(query);

        var url = (_.isEmpty(query))
          ? constants.apiurl + '/users'
          : constants.apiurl + '/users/search/' + query;

        fetch(url,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        })
        .then(res => res.json())
        .then(res => {
          this.userSearchQuery = query;
          this.userSearchResults.reset(res);
          if(this.loggedIn)
            this.userSearchResults.remove(this.user._id); // remove self from search results
          this.trigger(USER.SEARCH_COMPLETE);
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

  login(username, password) {
    console.log(username, password)
    fetch(constants.siteurl + '/login', {
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
      console.log('login success', res.user._id);
      // set the access and refresh tokens
      this.setTokens(
        res.accessToken,
        res.refreshToken,
        res.expires_in
      );
      // set the new user
      this.setUser(res.user);
      // trigger success
      this.trigger(USER.LOGIN_SUCCESS);
    })
    .catch(err => {
      console.log('login error', err.toString());
      // trigger error and pass along error message
      this.trigger(USER.LOGIN_ERROR, err.toString());
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

    this.trigger(USER.LOADED);
    this.trigger(USER.LOGIN_SUCCESS)
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
    console.log('tokens set!');
    this.tokensLoaded = true;
    AsyncStorage.setItem('access_token', accessToken);
    AsyncStorage.setItem('refresh_token', refreshToken);
    AsyncStorage.setItem('expires_in', expires_in.toString());
    this.trigger(USER.TOKENS_LOADED);
  },

  clearTokens() {
    AsyncStorage.removeItem('access_token');
    AsyncStorage.removeItem('refresh_token');
    AsyncStorage.removeItem('expires_in');
  },

  getUserImage(user, width, height) {
    var img_default = require('./../images/user-profile-icon.png');
    var source = { uri: ((_.isEmpty(user.image))
      ? ''
      : user.image.path) };
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
    if(source.uri.slice(7, 23) == 'api.joinbevy.com'
      && width != undefined
      && height != undefined
      && this.gup('w', user.image.path) == null
      && this.gup('h', user.image.path) == null) {
      source.uri += '?w=' + width + '&h=' + height;
    }
    return source;
  },

  gup(name, url) {
    if(!url) url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
  }
});
var dispatchToken = Dispatcher.register(UserStore.handleDispatch.bind(UserStore));
UserStore.dispatchToken = dispatchToken;

module.exports = UserStore;
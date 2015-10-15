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
var Fletcher = require('./../shared/components/android/Fletcher.android.js');

var {
  AsyncStorage
} = require('react-native');

var User = Backbone.Model.extend({
  defaults: {
    image_url: constants.siteurl + '/img/user-profile-icon.png'
  },
  _idAttribute: '_id'
});

var UserStore = _.extend({}, Backbone.Events);
_.extend(UserStore, {

  loggedIn: false, // simple flag to see if user is logged in or not
  user: new User,

  handleDispatch(payload) {
    switch(payload.actionType) {
      case APP.LOAD:
        // fetch user from server if its been updated?
        if(this.loggedIn) {
            this.user.fetch({
            success: function(model, response, options) {
              //console.log('user fetched from server');
              // update local storage user
              AsyncStorage.setItem('user', JSON.stringify(this.user.toJSON()));

              this.trigger(USER.LOADED);
            }.bind(this)
          });
        }
        break;

      case USER.LOGIN:
        var username = payload.username;
        var password = payload.password;
        console.log('logging in');

        Fletcher.fletch(constants.siteurl + '/login', {
          method: 'POST',
          headers: {},
          body: JSON.stringify({
            username: username,
            password: password
          })
        }, function(error) {
          console.error(error);
          this.trigger(USER.LOGIN_ERROR, error);
        }.bind(this), function(response) {
          response = JSON.parse(response);
          console.log('logged in', response);

          AsyncStorage.setItem('user', JSON.stringify(response))
            .then((err, result) => {
            });

          this.setUser(response);
          this.trigger(USER.LOGIN_SUCCESS, response);
        }.bind(this));

        /*fetch(constants.siteurl + '/login',
        {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: username,
            password: password
          })
        })
        // on fetch
        .then((res) => (res.json()))
        .then((res) => {
          if(res.object == undefined) {
            // success
            console.log('logged in', res);
            
            AsyncStorage.setItem('user', JSON.stringify(res))
            .then((err, result) => {
            });

            this.setUser(res);
            this.trigger(USER.LOGIN_SUCCESS, res);
          } else {
            console.log('error', res);
            // error
            this.trigger(USER.LOGIN_ERROR, res.message);
          }
        });*/

        break;

      case USER.LOGOUT:
        // remove google token
        AsyncStorage.removeItem('google_id');
        // remove user
        AsyncStorage.removeItem('user');

        this.user = new User;
        this.loggedIn = false;

        this.trigger(USER.LOADED);
        break;

      case USER.UPDATE:

        break;

      case USER.CHANGE_PROFILE_PICTURE:
        var uri = payload.uri;

        FileStore.upload(uri, (err, filename) => {
          console.log(err, filename);
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
    }
  },

  setUser(user) {
    this.user = new User(user);
    this.user.url = constants.apiurl + '/users/' + this.user.get('_id');
    this.loggedIn = true;
    //console.log(this.user.toJSON());
    this.trigger(USER.LOADED)
  },

  getUser() {
    if(!this.loggedIn) return {};
    return this.user.toJSON();
  }
});
var dispatchToken = Dispatcher.register(UserStore.handleDispatch.bind(UserStore));
UserStore.dispatchToken = dispatchToken;

module.exports = UserStore;
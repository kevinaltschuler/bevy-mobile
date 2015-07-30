'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var Dispatcher = require('./../shared/dispatcher');
var constants = require('./../constants');
var USER = constants.USER;
var BEVY = constants.BEVY;
var APP = constants.APP;

var {
  AsyncStorage
} = require('react-native');

var User = Backbone.Model.extend({
  _idAttribute: '_id'
});

var UserStore = _.extend({}, Backbone.Events);
_.extend(UserStore, {

  user: new User,

  handleDispatch(payload) {
    switch(payload.actionType) {
      case APP.LOAD:
        // fetch user from server if its been updated?
        this.user.fetch({
          success: function(model, response, options) {
            console.log('user fetched', response);
            // update local storage user
            AsyncStorage.setItem('user', JSON.stringify(this.user.toJSON()));

            this.trigger(USER.LOADED);
          }.bind(this)
        });

        break;
      case BEVY.SUBSCRIBE:
        var bevy_id = payload.bevy_id;
        var bevies = this.user.get('bevies');

        if(_.findWhere(bevies, { _id: bevy_id }) != undefined) break; // user is already subbed

        var bevy_ids = _.pluck(bevies, '_id');
        bevy_ids.push(bevy_id);

        this.user.save({
          bevies: bevy_ids
        }, {
          patch: true,
          success: function(model, response, options) {
            console.log(response);
            // update local storage user
            AsyncStorage.setItem('user', JSON.stringify(this.user.toJSON()));
            this.trigger(USER.LOADED);
          }.bind(this)
        });
        break;
      case BEVY.UNSUBSCRIBE:
        var bevy_id = payload.bevy_id;
        console.log(bevy_id);
        var bevies = this.user.get('bevies');
        bevies = _.reject(bevies, function(bevy) {
          return bevy._id == bevy_id;
        });
        var bevy_ids = _.pluck(bevies, '_id');
        console.log(bevy_ids);

        // save user to server
        this.user.save({
          bevies: bevy_ids
        }, {
          patch: true,
          success: function(model, response, options) {
            console.log(response);
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
    this.user.url = constants.apiurl + '/users/' + this.user.id;
    //console.log(this.user.toJSON());
    this.trigger(USER.LOADED)
  },

  getUser(user) {
    return this.user.toJSON();
  }
});
var dispatchToken = Dispatcher.register(UserStore.handleDispatch.bind(UserStore));
UserStore.dispatchToken = dispatchToken;

module.exports = UserStore;
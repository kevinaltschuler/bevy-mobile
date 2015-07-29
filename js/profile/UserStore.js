'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var Dispatcher = require('./../shared/dispatcher');
var constants = require('./../constants');
var USER = constants.USER;

var User = Backbone.Model.extend({

});

var UserStore = _.extend({}, Backbone.Events);
_.extend(UserStore, {

  user: new User,

  handleDispatch(payload) {
    switch(payload.actionType) {

    }
  },

  setUser(user) {
    this.user = new User(user);
    this.user.url = constants.apiurl + '/users';
    console.log(this.user.toJSON());
    this.trigger(USER.LOADED)
  },

  getUser(user) {
    return this.user.toJSON();
  }
});
var dispatchToken = Dispatcher.register(UserStore.handleDispatch.bind(UserStore));
UserStore.dispatchToken = dispatchToken;

module.exports = UserStore;
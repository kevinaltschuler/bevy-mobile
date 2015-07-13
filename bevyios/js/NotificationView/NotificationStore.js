'use strict';

var Backbone = require('backbone');
var _ = require('underscore');

var Dispatcher = require('./../shared/dispatcher');

var constants = require('./../constants');
var NOTIFICATION = constants.NOTIFICATION;
var APP = constants.APP;

var Notifications = require('./NotificationCollection');

var NotificationStore = _.extend({}, Backbone.Events);

_.extend(NotificationStore, {

  notifications: new Notifications,

  handleDispatch: function(payload) {
    switch(payload.actionType) {
      case APP.LOAD:

        this.notifications.url = constants.apiurl + '/users/' + constants.getUser()._id + '/notifications';

        this.notifications.fetch({
          reset: true,
          success: function(collection, response, options) {
            this.trigger(APP.LOAD_PROGRESS, 0.1);
            this.trigger(NOTIFICATION.CHANGE_ALL);
          }.bind(this)
        });

        break;

      case NOTIFICATION.DISMISS:
        var id = payload.id;

        var notification = this.notifications.get(id);
        if(notification == undefined) break;

        notification.destroy();
        this.trigger(NOTIFICATION.CHANGE_ALL);

        break;

      case NOTIFICATION.DISMISS_ALL:

        this.notifications.forEach(function(notification) {
          notification.destroy();
        });
        this.trigger(NOTIFICATION.CHANGE_ALL);

        break;
    }
  },

  getAll: function() {
    return this.notifications.toJSON();
  }
});

var dispatchToken = Dispatcher.register(NotificationStore.handleDispatch.bind(NotificationStore));
NotificationStore.dispatchToken = dispatchToken;

module.exports = NotificationStore;
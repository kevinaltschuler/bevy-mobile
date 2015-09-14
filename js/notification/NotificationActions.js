'use strict';

var dispatch = require('./../shared/helpers/dispatch');

var constants = require('./../constants');
var NOTIFICATION = constants.NOTIFICATION;

var NotificationActions = {
  dismiss: function(id) {
    dispatch(NOTIFICATION.DISMISS, {
      id: id
    });
  },
  dismissAll: function() {
    dispatch(NOTIFICATION.DISMISS_ALL, {

    });
  },
  read(id) {
    dispatch(NOTIFICATION.READ, {
      id: (id == undefined) ? '0' : id
    });
  }
};

module.exports = NotificationActions;
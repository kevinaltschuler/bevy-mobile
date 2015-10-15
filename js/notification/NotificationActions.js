/**
 * NotificationActions.js
 * @author albert
 */

'use strict';

var Dispacther = require('./../shared/dispatcher');
var constants = require('./../constants');
var NOTIFICATION = constants.NOTIFICATION;

var NotificationActions = {
  dismiss: function(id) {
    Dispatcher.dispatch({
      actionType: NOTIFICATION.DISMISS,
      id: id
    });
  },
  dismissAll: function() {
    Dispatcher.dispatch({
      actionType: NOTIFICATION.DISMISS_ALL
    });
  },
  read(id) {
    Dispatcher.dispatch({
      actionType: NOTIFICATION.READ,
      id: (id == undefined) ? '0' : id
    });
  }
};

module.exports = NotificationActions;
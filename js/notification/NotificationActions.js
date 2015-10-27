/**
 * NotificationActions.js
 * @author albert
 * @flow
 */

'use strict';

var Dispatcher = require('./../shared/dispatcher');
var constants = require('./../constants');
var NOTIFICATION = constants.NOTIFICATION;

var NotificationActions = {
  dismiss(id) {
    Dispatcher.dispatch({
      actionType: NOTIFICATION.DISMISS,
      id: id
    });
  },
  dismissAll() {
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
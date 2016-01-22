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
  fetch() {
    console.log('fetching...');
    Dispatcher.dispatch({
      actionType: NOTIFICATION.FETCH
    });
  },

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
  },
  registerDevice(token, user_id) {
    Dispatcher.dispatch({
      actionType: NOTIFICATION.REGISTER,
      token: (token == undefined) ? null : token,
      user_id: (user_id == undefined) ? null : user_id,
    });
  }
};

module.exports = NotificationActions;

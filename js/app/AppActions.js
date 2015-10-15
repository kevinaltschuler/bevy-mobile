/**
 * AppActions.js
 *
 * @author albert
 */

'use strict';

// imports
var Dispatcher = require('./../shared/dispatcher');

var APP = require('./../constants').APP;

var AppActions = {
  load() {
    Dispatcher.dispatch({
      actionType: APP.LOAD
    });
  },
  unload() {
    Dispatcher.dispatch({
      actionType: APP.UNLOAD
    });
  }
};
module.exports = AppActions;

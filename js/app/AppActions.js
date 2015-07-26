/**
 * AppActions.js
 *
 * @author albert
 */

'use strict';

// imports
var dispatch = require('./../shared/helpers/dispatch');

var APP = require('./../constants').APP;

var AppActions = {
  load: function() {
    dispatch(APP.LOAD, {

    });
  },
  unload: function() {
    dispatch(APP.UNlOAD, {
      
    });
  }

  /*progress: function(progress, message) {
    dispatch(APP.LOAD_PROGRESS, {
      progress: progress,
      message: message
    });
  }*/
};
module.exports = AppActions;

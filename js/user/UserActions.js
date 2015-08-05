'use strict';

var dispatch = require('./../shared/helpers/dispatch');
var constants = require('./../constants');
var USER = constants.USER;

var UserActions = {
  update() {
    dispatch(USER.UPDATE, {

    });
  },

  logOut() {
    dispatch(USER.LOGOUT, {}); 
  }
};

module.exports = UserActions;
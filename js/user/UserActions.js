'use strict';

var dispatch = require('./../shared/helpers/dispatch');
var constants = require('./../constants');
var USER = constants.USER;

var UserActions = {
  update() {
    dispatch(USER.UPDATE, {

    });
  },

  changeProfilePicture(uri: String) {
    dispatch(USER.CHANGE_PROFILE_PICTURE, {
      uri: uri
    });
  },

  logOut() {
    dispatch(USER.LOGOUT, {}); 
  }
};

module.exports = UserActions;
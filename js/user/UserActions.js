'use strict';

var Dispatcher = require('./../shared/dispatcher');
var constants = require('./../constants');
var USER = constants.USER;

var UserActions = {
  update() {
    Dispatcher.dispatch({
      actionType: USER.UPDATE
    });
  },

  switchUser(account_id) {
    Dispatcher.dispatch({
      actionType: USER.SWITCH_USER,
      account_id: account_id
    });
  },

  changeProfilePicture(uri: String) {
    Dispatcher.dispatch({
      actionType: USER.CHANGE_PROFILE_PICTURE,
      uri: uri
    });
  },

  logIn(username, password) {
    Dispatcher.dispatch({
      actionType: USER.LOGIN,
      username: username,
      password: password
    });
  },

  logInGoogle(google_id) {
    Dispatcher.dispatch({
      actionType: USER.LOGIN_GOOGLE,
      google_id: google_id
    });
  },

  logOut() {
    Dispatcher.dispatch({
      actionType: USER.LOGOUT
    }); 
  }
};

module.exports = UserActions;
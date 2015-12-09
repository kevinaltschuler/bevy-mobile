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

  changeProfilePicture(uri, image) {
    Dispatcher.dispatch({
      actionType: USER.CHANGE_PROFILE_PICTURE,
      uri: uri,
      image: image
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
  },

  register(username, password, email) {
    Dispatcher.dispatch({
      actionType: USER.REGISTER,
      username: username,
      password: password,
      email: (email == undefined) ? '' : email
    });
  },

  resetPassword(email) {
    Dispatcher.dispatch({
      actionType: USER.RESET_PASSWORD,
      email: email
    });
  },

  search(query) {
    Dispatcher.dispatch({
      actionType: USER.SEARCH,
      query: (query == undefined) ? null : query
    });
  },

  linkAccount(account) {
    Dispatcher.dispatch({
      actionType: USER.LINK_ACCOUNT,
      account: account
    });
  },

  unlinkAccount(account) {
    Dispatcher.dispatch({
      actionType: USER.UNLINK_ACCOUNT,
      account: account
    });
  },

  switchUser(account_id) {
    Dispatcher.dispatch({
      actionType: USER.SWITCH_USER,
      account_id: account_id
    });
  },

  verifyUsername(username) {
    Dispatcher.dispatch({
      actionType: USER.VERIFY_USERNAME,
      username: username
    });
  }
};

module.exports = UserActions;
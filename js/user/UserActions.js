/**
 * UserActions.js
 * @author albert
 * @flow
 */

'use strict';

var Dispatcher = require('./../shared/dispatcher');
var constants = require('./../constants');
var USER = constants.USER;

var UserActions = {
  loadUser(user) {
    Dispatcher.dispatch({
      actionType: USER.LOAD_USER,
      user: user
    })
  },

  fetch(user_id) {
    Dispatcher.dispatch({
      actionType: USER.FETCH,
      user_id: (user_id == undefined) ? null : user_id
    });
  },

  update() {
    Dispatcher.dispatch({
      actionType: USER.UPDATE
    });
  },

  changeProfilePicture(file) {
    Dispatcher.dispatch({
      actionType: USER.CHANGE_PROFILE_PICTURE,
      file: file
    });
  },

  logIn(username, password, bevySlug) {
    Dispatcher.dispatch({
      actionType: USER.LOGIN,
      username: username,
      password: password,
      bevySlug: bevySlug
    });
  },

  logInGoogle() {
    Dispatcher.dispatch({
      actionType: USER.LOGIN_GOOGLE,
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

  search(query, bevy_id, role) {
    Dispatcher.dispatch({
      actionType: USER.SEARCH,
      query: (query == undefined) ? null : query,
      bevy_id: (bevy_id == undefined) ? null : bevy_id,
      role: (role == undefined) ? null : role
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

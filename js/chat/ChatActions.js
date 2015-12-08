/**
 * ChatActions.js
 * @author albert
 * @flow
 */

'use strict';

var Dispatcher = require('./../shared/dispatcher');
var constants = require('./../constants');
var CHAT = constants.CHAT;

var ChatActions = {
  switchThread(thread_id: String) {
    Dispatcher.dispatch({
      actionType: CHAT.SWITCH,
      thread_id: thread_id
    });
  },

  createThreadAndMessage(addedUsers, messageBody) {
    Dispatcher.dispatch({
      actionType: CHAT.CREATE_THREAD_AND_MESSAGE,
      addedUsers: addedUsers || [],
      messageBody: messageBody || ''
    });
  },

  addUsers(thread_id, users) {
    Dispatcher.dispatch({
      actionType: CHAT.ADD_USERS,
      thread_id: thread_id,
      users: users || []
    });
  },

  removeUser(thread_id, user_id) {
    Dispatcher.dispatch({
      actionType: CHAT.REMOVE_USER,
      thread_id: thread_id,
      user_id: user_id
    });
  },

  deleteThread(thread_id) {
    Dispatcher.dispatch({
      actionType: CHAT.DELETE_THREAD,
      thread_id: thread_id
    });
  },

  editThread(thread_id, name, image) {
    Dispatcher.dispatch({
      actionType: CHAT.EDIT_THREAD,
      thread_id: thread_id,
      name: name,
      image: image
    });
  },

  startPM(user_id) {
    Dispatcher.dispatch({
      actionType: CHAT.START_PM,
      user_id: user_id
    });
  },

  fetchMore(thread_id: String) {
    Dispatcher.dispatch({
      actionType: CHAT.FETCH_MORE,
      thread_id: thread_id
    });
  },

  postMessage(thread_id: String, author: Object, body: String) {
    Dispatcher.dispatch({
      actionType: CHAT.POST_MESSAGE,
      thread_id: thread_id,
      author: author,
      body: body
    });
  },

  fetchThreads() {
    Dispatcher.dispatch({
      actionType: CHAT.FETCH_THREADS
    });
  }
};

module.exports = ChatActions;
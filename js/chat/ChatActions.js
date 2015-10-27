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
  }
};

module.exports = ChatActions;
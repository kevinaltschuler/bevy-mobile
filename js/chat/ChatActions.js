'use strict';

var dispatch = require('./../shared/helpers/dispatch');
var constants = require('./../constants');
var CHAT = constants.CHAT;

var ChatActions = {

  switchThread(thread_id: String) {
    dispatch(CHAT.SWITCH, {
      thread_id: thread_id
    });
  },

  fetchMore(thread_id: String) {
    dispatch(CHAT.FETCH_MORE, {
      thread_id: thread_id
    });
  },

  postMessage(thread_id: String, author: Object, body: String) {
    dispatch(CHAT.POST_MESSAGE, {
      thread_id: thread_id,
      author: author,
      body: body
    });
  }
};

module.exports = ChatActions;
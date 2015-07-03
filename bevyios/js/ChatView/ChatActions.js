'use strict';

var dispatch = require('./../shared/helpers/dispatch');
var constants = require('./../constants');
var CHAT = constants.CHAT;

var ChatActions = {
  fetchMore: function(thread_id) {
    dispatch(CHAT.FETCH_MORE, {
      thread_id: thread_id
    });
  }
};

module.exports = ChatActions;
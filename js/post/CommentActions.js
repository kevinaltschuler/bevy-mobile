/**
 * CommentActions.js
 * @author albert
 * @flow
 */

'use strict';

var Dispatcher = require('./../shared/dispatcher');
var constants = require('./../constants');
var COMMENT = constants.COMMENT;

var CommentActions = {
  create(body, author_id, post_id, parent_id) {
    Dispatcher.dispatch({
      actionType: COMMENT.CREATE,
      body: body,
      author_id: author_id,
      post_id: post_id,
      parent_id: (parent_id == undefined) ? null : parent_id
    });
  }
};

module.exports = CommentActions;
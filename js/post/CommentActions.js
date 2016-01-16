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
  },

  edit(comment_id, body) {
    Dispatcher.dispatch({
      actionType: COMMENT.EDIT,
      comment_id: comment_id,
      body: body
    });
  },

  destroy(post_id, comment_id) {
    Dispatcher.dispatch({
      actionType: COMMENT.DESTROY,
      post_id: post_id,
      comment_id: comment_id
    });
  }
};

module.exports = CommentActions;

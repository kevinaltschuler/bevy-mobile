/**
 * CommentActions.js
 *
 * Flux controller for comment actions
 *
 * @author albert
 * @flow
 */

'use strict';

var Dispatcher = require('./../shared/dispatcher');
var _ = require('underscore');
var constants = require('./../constants');
var COMMENT = constants.COMMENT;

var CommentActions = {
  /**
   * create a comment under the specified post
   * @param body {string} - the body of the comment to post
   * @param author {object} - the author of the comment (the current logged-in user)
   * @param post_id {string} - the id of the post to comment to
   * @param parent_id {string} - optional - the id of the comment that the new comment
   * is replying to
   */
  create(body: String, author: Object, post_id: String, parent_id: String) {
    // dont allow an empty comment
    if(_.isEmpty(body)) return;
    // dont allow a comment without an author
    if(_.isEmpty(author)) return;
    // dont allow a comment without a parent post
    if(_.isEmpty(post_id)) return;

    Dispatcher.dispatch({
      actionType: COMMENT.CREATE,
      body: body,
      author: author,
      post_id: post_id,
      parent_id: (parent_id == undefined) ? null : parent_id
    });
  },

  /**
   * edit the body of a given comment
   * @param comment_id {string} - the id of the comment to edit
   * @param body {string} - the new comment body
   */
  edit(comment_id: String, body: String) {
    // must specify which comment to edit
    if(_.isEmpty(comment_id)) return;
    // can't have the comment body be empty
    if(_.isEmpty(body)) return;

    Dispatcher.dispatch({
      actionType: COMMENT.EDIT,
      comment_id: comment_id,
      body: body
    });
  },

  /**
   * delete the given comment from the server, and remove locally
   * @param post_id {string} - the id of the comment's parent post
   * @param comment_id {string} - the id of the comment to delete
   */
  destroy(post_id: String, comment_id: String) {
    // must specify which post to delete from
    if(_.isEmpty(post_id)) return;
    // must specify which comment to delete
    if(_.isEmpty(comment_id)) return;

    Dispatcher.dispatch({
      actionType: COMMENT.DESTROY,
      post_id: post_id,
      comment_id: comment_id
    });
  }
};

module.exports = CommentActions;

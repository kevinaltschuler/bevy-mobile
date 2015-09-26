'use strict';

var dispatch = require('./../shared/helpers/dispatch');
var constants = require('./../constants');
var COMMENT = constants.COMMENT;

var CommentActions = {
  create(body, author_id, post_id, parent_id) {
    dispatch(COMMENT.CREATE, {
      body: body,
      author_id: author_id,
      post_id: post_id,
      parent_id: (parent_id == undefined) ? null : parent_id
    });
  }
};

module.exports = CommentActions;
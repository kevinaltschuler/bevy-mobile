/**
 * PostModel.js
 *
 * post backbone model
 * corresponds (hopefully) with the mongoose model
 * in models/Post.js
 *
 * @author albert
 */

'use strict';

// imports
var Backbone = require('backbone');
var _ = require('underscore');

var constants = require('./../constants');

var BevyStore = require('./../bevy/BevyStore');
var UserStore = require('./../user/UserStore');

// backbone model
var Post = Backbone.Model.extend({
  idAttribute: '_id',

  initialize() {
    console.log('init post');
    var user = UserStore.getUser();
    var vote = _.findWhere(this.get('votes'), { voter: user._id });
    if(vote == undefined) this.set('voted', false);
    else {
      if(vote.score <= 0) this.set('voted', false);
      else this.set('voted', true);
    }

    this.updateComments();
    this.on('sync', this.updateComments);
  },

  updateComments() {
    console.log('post sync', this.get('_id'));
    var comments = this.get('comments');
    var nestedComments, commentCount;
    if(comments == undefined || comments.length <= 0) {
      nestedComments = [];
      commentCount = 0;
    } else {
      nestedComments = this.nestComments(comments);
      commentCount = nestedComments.length;
    }
    this.set({
      nestedComments: nestedComments,
      commentCount: commentCount
    });
  },

  nestComments(comments, parentId, depth) {
    // increment depth (used for indenting later)
    if(typeof depth === 'number') depth++;
    else depth = 0;
    if(_.isEmpty(comments)) return;
    if(comments.length < 0) return []; // return if it's the end of the line

    var $comments = [];
    for(var key in comments) {
      var comment = comments[key];
      // look for comments under this one
      if(comment.parentId == parentId) {
        comment.depth = depth;
        // and keep going
        comment.comments = this.nestComments(comments, comment._id, depth);
        $comments.push(comment);
        // TODO: splice the matched comment out of the list so we can go faster
      }
    };

    return $comments;
  },

  sync(method, model, options) {
    Backbone.Model.prototype.sync.apply(this, arguments);
  },

  countVotes() {
    var sum = 0;
    this.get('votes').forEach(function(vote) {
      sum += vote.score;
    });
    return sum;
  }
});

module.exports = Post;

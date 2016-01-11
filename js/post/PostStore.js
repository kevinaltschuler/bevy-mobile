/**
 * PostStore.js
 *
 * Backbone and React and Flux confluence
 * for bevies
 *
 * @author kevins armpit hair
 */

'use strict';

// imports
var Backbone = require('backbone');
var _ = require('underscore');
var React = require('react-native');
var {
  Platform
} = React;

var Dispatcher = require('./../shared/dispatcher');

var Post = require('./PostModel');
var Posts = require('./PostCollection');

var constants = require('./../constants');
var BEVY = constants.BEVY;
var POST = constants.POST;
var CHAT = constants.CHAT;
var APP = constants.APP;
var COMMENT = constants.COMMENT;
var USER = constants.USER;

var PostActions = require('./PostActions');
var BevyStore = require('./../bevy/BevyStore');
var UserStore = require('./../user/UserStore');

// inherit event class first
// VERY IMPORTANT, as the PostContainer view binds functions
// to this store's events
var PostStore = _.extend({}, Backbone.Events);

// now add some custom functions
_.extend(PostStore, {

  posts: new Posts,
  sortType: 'new',

  // handle calls from the dispatcher
  // these are created from BevyActions.js
  handleDispatch(payload) {
    switch(payload.actionType) {

      case APP.LOAD:
        break;

      case POST.FETCH:
        var bevy_id = payload.bevy_id;
        var user_id = payload.user_id;

        if(user_id)
          this.posts.url = constants.apiurl + '/users/' + user_id + '/posts';
        else
          this.posts.url = constants.apiurl + '/bevies/' + bevy_id + '/posts';

        // reset all posts first, and trigger loading
        this.posts.reset();
        this.trigger(POST.LOADING);
        this.trigger(POST.CHANGE_ALL);

        console.log('fetching posts from...', this.posts.url);

        // then fetch
        this.posts.fetch({
          reset: true,
          success: function(posts, response, options) {
            console.log('fetched posts');
            // trigger sort which will trigger loaded and change all
            this.posts.sort();
            this.trigger(POST.LOADED);
            this.trigger(POST.CHANGE_ALL);
          }.bind(this)
        });
        break;

      case POST.CREATE:
        var title = payload.title;
        var images = payload.images;
        var author = payload.author;
        var board = payload.board;
        var type = payload.type;
        var event = payload.event;

        // create new backbone model
        var newPost = this.posts.add({
          title: title,
          comments: [],
          images: images,
          author: author._id,
          board: board._id,
          created: Date.now(),
          type: type,
          event: event,
        });

        // explicitly set url for safety
        newPost.url = constants.apiurl + '/posts';

        // save to server
        newPost.save(null, {
          success: function(post, response, options) {
            // repopulate the model
            newPost.set('_id', post.id);
            newPost.set('images', post.get('images'));
            newPost.set('links', post.get('links'));
            newPost.set('author', author);
            newPost.set('board', board);
            newPost.set('type', type);
            newPost.set('event', event);
            newPost.set('commentCount', 0);

            // resort the posts to accomodate for the new post
            this.posts.sort();

            // trigger events
            this.trigger(POST.CHANGE_ALL);
            this.trigger(POST.POST_CREATED, newPost.toJSON());
          }.bind(this)
        });
        break;

      case POST.VOTE:
        var post_id = payload.post_id;
        var post = this.posts.get(post_id);
        var user = UserStore.getUser();
        if(post == undefined) break;

        // cant vote if user is not part of the bevy (DONT DO THIS YET ACTUALLY)
        //if(!_.contains(user.bevies, post.get('bevy'))) break;

        var votes = post.get('votes');
        var vote = _.findWhere(votes, { voter: user._id });
        if(vote == undefined) {
          // vote not found. create one
          votes.push({
            voter: user._id,
            score: 1
          });
          post.set('voted', true);
        } else {
          if(vote.score <= 0) {
            // vote found but net score is 0. add one
            vote.score = 1;
            post.set('voted', true);
          } else {
            // user is un-voting. subtract one
            vote.score = 0;
            post.set('voted', false);
          }
        }
        post.save({
          votes: votes
        }, {
          patch: true,
          success: function(post, response, options) {
            // sort posts
            //this.posts.sort();
            this.trigger(POST.CHANGE_ONE + post_id);
          }.bind(this)
        });

        break;

      case POST.DESTROY:
        var post_id = payload.post_id;
        var post = this.posts.get(post_id);
        if(_.isEmpty(post)) {
          console.log('nothing to destroy');
          break;
        }

        post.url = constants.apiurl + '/bevies/' + post.bevy + '/posts/' + post_id;

        post.destroy({
          success: function(model, response) {
            this.trigger(POST.CHANGE_ALL);
            this.trigger(POST.REFRESH);
          }.bind(this),
          error: function(err) {
            console.log(err);
          }
        });

        break;

      case POST.UPDATE:
        var post_id = payload.post_id;
        var post = this.posts.get(post_id);
        if(post == undefined) return;

        var title = payload.title || post.get('title');
        var images = payload.images || post.get('images');
        var tag = payload.tag || post.get('tag');
        var event = payload.event || post.get('event');

        post.set('title', title);
        post.set('images', images);
        post.set('tag', tag);
        post.set('event', event);

        post.save({
          title: title,
          images: images,
          tag: tag,
          event: event,
          updated: Date.now()
        }, {
          patch: true,
          success: function($post, response, options) {
          }.bind(this)
        });
        // trigger update
        this.trigger(POST.CHANGE_ONE + post.get('_id'));
        this.trigger(POST.CHANGE_ALL);
        break;

      case POST.SORT:
        var by = payload.by;
        var direction = payload.direction;

        by = by.trim(); // trim whitespace - it sometimes makes it in there
        switch(by) {
          case 'new':
            this.sortType = 'new';
            this.posts.comparator = this.sortByNew;
            break;
          case 'top':
            this.sortType = 'top';
            this.posts.comparator = this.sortByTop;
            break;
        }
        this.posts.sort();

        this.trigger(POST.CHANGE_ALL);
        this.trigger(POST.LOADED);
        break;

        case POST.PIN:
          var post_id = payload.post_id;
          var post = this.posts.get(post_id);
          if(post == undefined) break;

          var pinned = !post.get('pinned');
          var expires = (pinned)
          ? new Date('2035', '1', '1') // expires in a long time
          : new Date(Date.now() + (post.get('bevy').settings.posts_expire_in
            * 1000 * 60 * 60 * 24)) // unpinned - expire like default

          if(!pinned && (post.get('bevy').settings.posts_expire_in == -1))
            expires = new Date('2035', '1', '1');

          post.set('pinned', pinned);
          post.set('expires', expires);

          post.save({
            pinned: pinned,
            expires: expires
          }, {
            patch: true
          });

          this.posts.sort();
          this.trigger(POST.CHANGE_ALL);
          this.trigger(POST.CHANGE_ONE + post_id);
          break;

      case BEVY.SWITCH:
        var bevy_id = payload.bevy_id;
        this.posts.comparator = this.sortByNew;
        this.posts.url = constants.apiurl + '/bevies/' + bevy_id + '/posts';
        this.posts.fetch({
          success: function(collection, response, options) {
            this.posts.sort();
            this.trigger(POST.CHANGE_ALL);
          }.bind(this)
        });
        break;

      case COMMENT.CREATE:
        var body = payload.body;
        var author_id = payload.author_id;
        var post_id = payload.post_id;
        var parent_id = payload.parent_id;

        var post = this.posts.get(post_id);
        if(post == undefined) break;

        var comment = new Backbone.Model({
          body: body,
          author: author_id,
          postId: post_id,
          parentId: parent_id,
          comments: []
        });
        comment.url = constants.apiurl + '/comments';
        comment.save(null, {
          success: function(model, response, options) {
            // add to post
            var comments = post.get('comments') || [];
            comments.push(model);
            post.set('comments', comments);
            // trigger updates
            //this.trigger(POST.CHANGE_ALL);
            //this.trigger(POST.CHANGE_ONE + post_id);
          }.bind(this)
        });
        break;

      case COMMENT.EDIT:
        var post_id = payload.post_id;
        var comment_id = payload.comment_id;
        var body = payload.body;

        var url = constants.apiurl + '/posts/' + post_id + '/comments/' + comment_id;
        fetch(url, {
          method: 'PATCH',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            body: body
          })
        })
        .then(res => res.json())
        .then(res => {
          this.trigger(POST.CHANGE_ALL);
          this.trigger(POST.CHANGE_ONE + post_id);
        });
        break;

      case COMMENT.DESTROY:
        var post_id = payload.post_id;
        var comment_id = payload.comment_id;
        var url = constants.apiurl + '/comments/' + comment_id;

        fetch(url, {
          method: 'DELETE'
        })
        .then(res => res.json())
        .then(res => {
          //this.trigger(POST.CHANGE_ALL);
          //this.trigger(POST.CHANGE_ONE + post_id);
        });

        var post = this.posts.get(post_id);
        var comments = post.get('comments');

        if(_.findWhere(comments, { _id: comment_id })) {
          // delete from post
          comments = _.reject(comments, comment => {
            return comment._id == comment_id;
          });
          post.set('comments', comments);
        } else {
          // delete from comment
          this.removeComment(comments, comment_id);
        }

        var commentCount = post.get('commentCount');
        post.set('commentCount', --commentCount);
        //this.postsNestComment(post);

        this.trigger(POST.CHANGE_ALL);
        //this.trigger(POST.CHANGE_ONE + post_id);
        break;
    }
  },

  /**
   * recursively remove a comment
   */
  removeComment(comments, comment_id) {
    // use every so we can break out if we need
    return comments.every((comment, index) => {
      if(comment._id == comment_id) {
        // it's a match. remove the comment and collapse
        comments.splice(index, 1);
        return false;
      }
      if(_.isEmpty(comment.comments)) {
        // end of the line. collapse
        return false;
      }
      else {
        // there's more. keep going
        return this.removeComment(comment.comments, comment_id);
      }
      // continue the every loop
      return true;
    });
  },

  sortByTop(post) {
    var score = post.countVotes();
    if(post.get('pinned')) score = 9000;
    return -score;
  },

  sortByNew(post) {
    var date = Date.parse(post.get('created'));
    if(post.get('pinned')) date = new Date('2035', '1', '1');
    return -date;
  },

  getAll() {
    return this.posts.toJSON();
  },

  getPost(post_id) {
    var post = this.posts.get(post_id);
    if(post == undefined) return {};
    else return post.toJSON();
  },

  getPostVoteCount(post_id) {
    var sum = 0;
    var post = this.posts.get(post_id);
    if(post == undefined) return sum;
    post.get('votes').forEach(function(vote) {
      sum += vote.score;
    });
    return sum;
  }
});

var dispatchToken = Dispatcher.register(PostStore.handleDispatch.bind(PostStore));
PostStore.dispatchToken = dispatchToken;

module.exports = PostStore;

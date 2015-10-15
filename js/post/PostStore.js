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

var Dispatcher = require('./../shared/dispatcher');

var Post = require('./PostModel');
var Posts = require('./PostCollection');

var constants = require('./../constants');
var BEVY = constants.BEVY;
var POST = constants.POST;
var CONTACT = constants.CONTACT;
var CHAT = constants.CHAT;
var APP = constants.APP;
var COMMENT = constants.COMMENT;
var USER = constants.USER;

var PostActions = require('./PostActions');
var BevyStore = require('./../bevy/BevyStore');
var UserStore = require('./../user/UserStore');

var tagRegex = /#\w+/g;


// inherit event class first
// VERY IMPORTANT, as the PostContainer view binds functions
// to this store's events
var PostStore = _.extend({}, Backbone.Events);

// now add some custom functions
_.extend(PostStore, {

  posts: new Posts,

  // handle calls from the dispatcher
  // these are created from BevyActions.js
  handleDispatch(payload) {
    switch(payload.actionType) {

      case APP.LOAD:
      case USER.LOGOUT:
      case USER.LOGIN:
        // frontpage posts
        this.posts.url = constants.apiurl + '/users/' + UserStore.getUser()._id + '/frontpage';
        this.posts.comparator = this.sortByTop;

        this.posts.fetch({
          reset: true,
          success: function(posts, response, options) {
            //this.trigger(APP.LOAD_PROGRESS, 0.5);
            this.trigger(POST.LOADED);
            this.trigger(POST.CHANGE_ALL);
          }.bind(this)
        });

        // trigger anyways
        this.trigger(POST.CHANGE_ALL);
        
        break;

      case POST.FETCH:
        var bevy = payload.bevy;
        var user_id = payload.user_id;

        if(user_id) {
          this.posts.url = constants.apiurl + '/users/' + user_id + '/posts';
        } else if(bevy._id == -1) {
          this.posts.url = constants.apiurl + '/users/' + UserStore.getUser()._id + '/frontpage';
        } else {
          this.posts.url = constants.apiurl + '/bevies/' + bevy._id + '/posts';
        }
        // reset all posts first
        this.posts.reset();
        this.trigger(POST.CHANGE_ALL);
        
        // then fetch
        this.posts.fetch({
          success: function(posts, response, options) {
            this.trigger(POST.LOADED);
            this.trigger(POST.CHANGE_ALL);
          }.bind(this)
        });

        break;

      case POST.CREATE:
        // collect payload vars
        var title = payload.title;
        var images = payload.images;
        var author = payload.author;
        var bevy = payload.bevy;

        console.log(payload);

        var newPost = this.posts.add({
          title: title,
          comments: [],
          images: images,
          author: author._id,
          bevy: bevy._id
        });

        newPost.url = constants.apiurl + '/bevies/' + bevy._id + '/posts';

        // save to server
        newPost.save(null, {
          success: function(post, response, options) {
            // success
            newPost.set('author', author);
            newPost.set('bevy', tempBevy);
            newPost.set('commentCount', 0);

            this.posts.sort();

            this.trigger(POST.CHANGE_ALL);
            this.trigger(POST.POSTED_POST);
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

        break;

      case POST.UPDATE:

        break;

      case BEVY.SWITCH:
        Dispatcher.waitFor([BevyStore.dispatchToken]);
        var bevy_id = BevyStore.active;

        if(bevy_id == -1)
          this.posts.url = constants.apiurl + '/users/' + UserStore.getUser()._id + '/frontpage';
        else {
          this.posts.url = constants.apiurl + '/bevies/' + bevy_id + '/posts';
        }

        this.posts.fetch({
          reset: true,
          success: function(posts, response, options) {
            this.trigger(POST.CHANGE_ALL);
          }.bind(this)
        });

        // clear posts immediately
        this.posts.reset();
        this.trigger(POST.CHANGE_ALL);
        this.trigger(POST.LOADED);

        break;

      case COMMENT.CREATE:
        var body = payload.body;
        var author_id = payload.author_id;
        var post_id = payload.post_id;
        var parent_id = payload.parent_id;

        var comment = new Backbone.Model({
          body: body,
          author: author_id,
          postId: post_id,
          parentId: parent_id,
          comments: []
        });
        comment.url = constants.apiurl + '/comments';
        comment.save();
        this.trigger(POST.CHANGE_ALL); // custom event for this later?
        //this.trigger(POST.CHANGE_ONE + post_id);
        break;
    }
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

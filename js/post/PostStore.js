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
  sortType: 'new',

  // handle calls from the dispatcher
  // these are created from BevyActions.js
  handleDispatch(payload) {
    switch(payload.actionType) {

      case APP.LOAD:
        if(UserStore.loggedIn) {
          this.posts.url = 
            constants.apiurl + '/users/' + UserStore.getUser()._id + '/frontpage';
        } else {
          this.posts.url =
            constants.apiurl + '/frontpage';
        }
        // frontpage posts
        this.posts.comparator = this.sortByNew;
        this.sortType = 'new';

        // trigger loading event so frontend can respond
        this.trigger(POST.LOADING);

        this.posts.fetch({
          reset: true,
          success: function(posts, response, options) {
            // trigger events to let frontend knows that data is available
            this.trigger(POST.LOADED);
            this.trigger(POST.CHANGE_ALL);
          }.bind(this)
        });

        // trigger anyways
        this.trigger(POST.CHANGE_ALL); 
        break;

      case POST.FETCH:
        var bevy_id = payload.bevy_id;
        var profile_user_id = payload.user_id;
        var user = UserStore.getUser()._id;
        var loggedIn = UserStore.loggedIn;

        if(bevy_id == null) {
          // fetch user profile posts
          this.posts.url = 
            constants.apiurl + '/users/' + profile_user_id + '/posts';
        } else if(bevy_id == -1 && loggedIn) {
          // fetch user frontpage posts
          this.posts.url = 
            constants.apiurl + '/users/' + UserStore.getUser()._id + '/frontpage';
        } else if(bevy_id == -1 && !loggedIn) {
          // fetch public frontpage posts
          this.posts.url = constants.apiurl + '/frontpage';
        } else {
          // fetch bevy posts
          this.posts.url = constants.apiurl + '/bevies/' + bevy_id + '/posts';
        }
        // reset all posts first, and trigger loading
        this.posts.reset();
        this.trigger(POST.LOADING);
        this.trigger(POST.CHANGE_ALL);
        
        // then fetch
        this.posts.fetch({
          success: function(posts, response, options) {
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
        var bevy = payload.bevy;
        var type = payload.type;
        var event = payload.event;
        var tag = payload.tag;

        var posts_expire_in;
        if(bevy.settings.posts_expire_in && bevy.settings.posts_expire_in > 0) {
          // if the bevy has a posts_expire_in setting, then apply it
          posts_expire_in = bevy.settings.posts_expire_in // in days
          posts_expire_in *= (1000 * 60 * 60 * 24); // convert to seconds
          posts_expire_in += Date.now(); // add now
        } else {
          // by default, dont expire
          posts_expire_in = new Date('2035', '1', '1');
        }

        // create new backbone model
        var newPost = this.posts.add({
          title: title,
          comments: [],
          images: images,
          author: author._id,
          bevy: bevy._id,
          created: Date.now(),
          expires: posts_expire_in,
          type: type,
          event: event,
          tag: tag
        });

        // explicitly set url for safety
        newPost.url = constants.apiurl + '/bevies/' + bevy._id + '/posts';

        // save to server
        newPost.save(null, {
          success: function(post, response, options) {
            // repopulate the model
            newPost.set('_id', post.id);
            newPost.set('images', post.get('images'));
            newPost.set('links', post.get('links'));
            newPost.set('author', author);
            newPost.set('bevy', bevy);
            newPost.set('type', type);
            newPost.set('event', event);
            newPost.set('commentCount', 0);

            // resort the posts to accomodate for the new post
            this.posts.sort();

            // trigger events
            this.trigger(POST.POSTED_POST);
            this.trigger(POST.CHANGE_ALL);

            this.trigger(POST.POST_CREATED, post.id);
          }.bind(this),
          error: function(err) {
            console.log(err);
          }
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

        var post_id = payload.post_id;
        var title = payload.postTitle;

        var post = this.posts.get(post_id);

        post.set('title', title);

        post.save({
          title: title,
          updated: Date.now()
        }, {
          patch: true,
          success: function($post, response, options) {
            this.trigger(POST.CHANGE_ALL);
          }.bind(this)
        });

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

      case BEVY.SWITCH:
        Dispatcher.waitFor([BevyStore.dispatchToken]);
        var bevy_id = BevyStore.active;

        if(bevy_id == -1)
          this.posts.url = constants.apiurl + '/users/' + UserStore.getUser()._id + '/frontpage';
        else {
          this.posts.url = constants.apiurl + '/bevies/' + bevy_id + '/posts';
        }

        this.trigger(POST.LOADING);

        this.posts.fetch({
          reset: true,
          success: function(posts, response, options) {
            this.trigger(POST.LOADED);
            this.trigger(POST.CHANGE_ALL);
          }.bind(this)
        });

        // clear posts immediately
        this.posts.reset();
        this.trigger(POST.CHANGE_ALL);
        //this.trigger(POST.LOADED);

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

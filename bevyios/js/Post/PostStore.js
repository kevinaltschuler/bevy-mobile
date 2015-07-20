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
//var $ = require('jquery');
var _ = require('underscore');

//var router = require('./../router');

var Dispatcher = require('./../shared/dispatcher');

var Post = require('./PostModel');
var Posts = require('./PostCollection');

var constants = require('./../constants');
var BEVY = constants.BEVY;
var POST = constants.POST;
var CONTACT = constants.CONTACT;
var CHAT = constants.CHAT;
var APP = constants.APP;

var PostActions = require('./PostActions');
var BevyStore = require('./../BevyView/BevyStore');

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
  handleDispatch: function(payload) {
    switch(payload.actionType) {

      case APP.LOAD:

        this.posts.url = constants.apiurl + '/users/' + constants.getUser()._id + '/posts';
        this.posts.comparator = this.sortByTop;

        this.posts.fetch({
          reset: true,
          success: function(posts, response, options) {
            //this.trigger(APP.LOAD_PROGRESS, 0.5);
            this.trigger(POST.LOADED);
            this.trigger(POST.CHANGE_ALL);
          }.bind(this)
        });
        
        break;

      case POST.FETCH:
        var bevy = payload.bevy;

        if(bevy._id == -1) {
          this.posts.url = constants.apiurl + '/users/' + constants.getUser()._id + '/posts';
        } else {
          this.posts.url = constants.apiurl + '/bevies/' + bevy._id + '/posts';
        }
        this.posts.fetch({
          reset: true,
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
          bevy: bevy._id,
          created: Date.now()
        });

        newPost.url = constants.apiurl + '/bevies/' + bevy._id + '/posts';

        // save to server
        newPost.save(null, {
          success: function(post, response, options) {
            // success
            newPost.set('_id', post.id);
            newPost.set('images', post.get('images'));
            newPost.set('links', post.get('links'));
            newPost.set('author', author);
            newPost.set('bevy', tempBevy);
            newPost.set('commentCount', 0);

            this.posts.sort();

            this.trigger(POST.CHANGE_ALL);
            this.trigger(POST.POSTED_POST);
          }.bind(this)
        });

        break;

      case POST.UPVOTE:
        var post_id = payload.post_id;
        var voter = payload.voter;

        this.vote(post_id, voter, 1);

        break;

      case POST.DOWNVOTE:
        var post_id = payload.post_id;
        var voter = payload.voter;

        this.vote(post_id, voter, -1);

        break;

      case POST.DESTROY:
        /*var id = payload.id;
        var bevy = this.bevies.get(id);
        bevy.destroy({
          success: function(model, response) {
            // switch to the frontpage
            router.navigate('/b/frontpage', { trigger: true });

            // update posts
            BevyActions.switchBevy();

            this.trigger(BEVY.CHANGE_ALL);
          }.bind(this)
        });*/

        break;

      case POST.UPDATE:
        /*var bevy_id = payload.bevy_id;

        var bevy = this.bevies.get(bevy_id);

        var name = payload.name || bevy.get('name');
        var description = payload.description || bevy.get('description');
        var image_url = payload.image_url || bevy.get('image_url');
        var settings = payload.settings || bevy.get('settings');

        bevy.set({
          name: name,
          description: description,
          image_url: image_url,
          settings: settings
        });

        bevy.save({
          name: name,
          description: description,
          image_url: image_url,
          settings: settings
        }, {
          patch: true
        });

        this.trigger(BEVY.CHANGE_ALL);
        this.trigger(BEVY.UPDATED_IMAGE);
        // update more stuff
        this.trigger(POST.CHANGE_ALL);
        this.trigger(CHAT.CHANGE_ALL);
        this.trigger(CONTACT.CHANGE_ALL);*/

        break;

      case BEVY.SWITCH:

        var bevy_id = payload.bevy_id;

        if(bevy_id == -1)
          this.posts.url = constants.apiurl + '/users/' + constants.getUser()._id + '/posts';
        else
          this.posts.url = constants.apiurl + '/bevies/' + bevy_id + '/posts';

        this.posts.fetch({
          reset: true,
          success: function(posts, response, options) {
            this.trigger(POST.CHANGE_ALL);
          }.bind(this)
        });

        break;
    }
  },

  vote: function(post_id, voter, value) {
    var MAX_VOTES = 5;
    var post = this.posts.get(post_id);
    var votes = post.get('votes');

    if(_.isEmpty(votes)) {
      // create new voter
      votes.push({
        voter: voter._id,
        score: value
      });
    } else {
      var vote = _.findWhere(votes, { voter: voter._id });
      if(vote == undefined) {
        // voter not found, create new voter
        votes.push({
          voter: voter._id,
          score: value
        });
      } else {
        // check if they've exceeded their max votes
        if(Math.abs(vote.score + value) > MAX_VOTES)
          return;
        // add score to existing voter
        vote.score += value;
      }
    }
    //post.set('votes', votes);
    // save to server
    post.save({
      votes: votes
    }, {
      patch: true,
      success: function(post, response, options) {
        // sort posts
        this.posts.sort();
      }.bind(this)
    });
  },

  sortByTop: function(post) {
    var score = post.countVotes();
    if(post.get('pinned') && router.bevy_id != -1) score = 9000;
    return -score;
  },

  sortByNew: function(post) {
    var date = Date.parse(post.get('created'));
    if(post.get('pinned') && router.bevy_id != -1) date = new Date('2035', '1', '1');
    return -date;
  },

  getAll: function() {
    return this.posts.toJSON();
  }
});

var dispatchToken = Dispatcher.register(PostStore.handleDispatch.bind(PostStore));
PostStore.dispatchToken = dispatchToken;

module.exports = PostStore;

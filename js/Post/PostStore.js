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
var COMMENT = constants.COMMENT;

var PostActions = require('./PostActions');
var BevyStore = require('./../bevy/BevyStore');
var UserStore = require('./../profile/UserStore');

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

        this.posts.url = constants.apiurl + '/users/' + UserStore.getUser()._id + '/posts';
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
          this.posts.url = constants.apiurl + '/users/' + UserStore.getUser()._id + '/posts';
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
        Dispatcher.waitFor([BevyStore.dispatchToken]);
        var bevy_id = BevyStore.active;

        if(bevy_id == -1)
          this.posts.url = constants.apiurl + '/users/' + UserStore.getUser()._id + '/posts';
        else {
          this.posts.url = constants.apiurl + '/bevies/' + bevy_id + '/posts';
        }

        this.posts.fetch({
          reset: true,
          success: function(posts, response, options) {
            this.trigger(POST.CHANGE_ALL);
          }.bind(this)
        });

        break;

      case COMMENT.CREATE:
        var body = payload.body;
        var author_id = payload.author_id;
        var post_id = payload.post_id;
        var parent_id = payload.parent_id;

        fetch(constants.apiurl + '/comments', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            body: body,
            author: author_id,
            postId: post_id,
            parentId: parent_id
          })
        })
        .then((res) => {
          var response = JSON.parse(res._bodyText);

          // add comment to posts collection
          /*var post = this.posts.get(post_id);
          var comments = post.get('comments');
          comments.push({
            _id: response._id,
            body: body,
            author: UserStore.getUser(),
            postId: post.toJSON(),
            parentId: parent_id,
            created: response.created,
            updated: response.updated,
            comments: []
          });
          this.trigger(POST.CHANGE_ALL); // custom event for this later?*/
          this.trigger(POST.CHANGE_ONE + post_id);
        });
        break;
    }
  },

  sortByTop(post) {
    var score = post.countVotes();
    if(post.get('pinned') && router.bevy_id != -1) score = 9000;
    return -score;
  },

  sortByNew(post) {
    var date = Date.parse(post.get('created'));
    if(post.get('pinned') && router.bevy_id != -1) date = new Date('2035', '1', '1');
    return -date;
  },

  getAll() {
    return this.posts.toJSON();
  },

  getPost(post_id) {
    var post = this.posts.get(post_id);
    if(post == undefined) return {};
    else return post.toJSON();
  }
});

var dispatchToken = Dispatcher.register(PostStore.handleDispatch.bind(PostStore));
PostStore.dispatchToken = dispatchToken;

module.exports = PostStore;

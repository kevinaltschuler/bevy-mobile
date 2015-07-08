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
            this.trigger(POST.CHANGE_ALL);
          }.bind(this)
        });
        
        break;

      case POST.CREATE:
        /*var name = payload.name;
        var description = payload.description;
        var image_url = payload.image_url;

        var user = window.bootstrap.user;

        var members = [];

        // add yerself
        members.push({
          email: user.email,
          user: (_.isEmpty(user)) ? null : user._id,
          role: 'admin'
        });

        var newBevy = this.bevies.add({
          name: name,
          description: description,
          members: members,
          image_url: image_url
        });

        newBevy.save(null, {
          success: function(model, response, options) {
            // success
            newBevy.set('_id', model.id);
            newBevy.set('members', model.get('members'));

            // switch to bevy
            router.navigate('/b/' + model.id, { trigger: true });

            // update posts
            BevyActions.switchBevy();

            this.trigger(BEVY.CHANGE_ALL);
          }.bind(this)
        });*/

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

        this.posts.url = constants.apiurl + '/bevies/' + bevy_id + '/posts'

        this.posts.fetch({
          reset: true,
          success: function(posts, response, options) {
            this.trigger(POST.CHANGE_ALL);
          }.bind(this)
        });

        break;
    }
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

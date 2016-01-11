/**
 * BevyStore.js
 *
 * Backbone and React and Flux confluence
 * for bevies
 *
 * @author albert
 */

'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var Dispatcher = require('./../shared/dispatcher');
var getSlug = require('speakingurl');
var React = require('react-native');

var Bevies = require('./BevyCollection');
var Boards = require('./../board/BoardCollection');
var Board = require('./../board/BoardModel');
var Invites = require('./InviteCollection');
var Invite = require('./InviteModel');
var {
  Platform,
  ToastAndroid
} = React;
var async = require('async');

//var Bevy = require('./BevyModel');
//var Bevies = require('./BevyCollection');

var Bevy = Backbone.Model.extend({
  initialize() {
    this.bevies = new Bevies;
  },
  idAttribute: '_id'
});

// backbone collection
var Bevies = Backbone.Collection.extend({
  model: Bevy,
  comparator: bevy => bevy.get('name').toLowerCase() // sort alphabetically and
                                                     // ignore case
});

var constants = require('./../constants');
var BEVY = constants.BEVY;
var POST = constants.POST;
var CHAT = constants.CHAT;
var APP = constants.APP;
var USER = constants.USER;
var BOARD = constants.BOARD;
var INVITE = constants.INVITE;

var BevyActions = require('./BevyActions');
var UserStore = require('./../user/UserStore');

// inherit event class first
// VERY IMPORTANT, as the PostContainer view binds functions
// to this store's events
var BevyStore = _.extend({}, Backbone.Events);

// now add some custom functions
_.extend(BevyStore, {
  myBevies: new Bevies,
  publicBevies: new Bevies,
  searchQuery: '',
  searchList: new Bevies,
  active: new Bevy,
  activeBoard: new Board,
  bevyBoards: new Boards,
  bevyInvites: new Invites,

  // handle calls from the dispatcher
  // these are created from BevyActions.js
  handleDispatch(payload) {
    switch(payload.actionType) {

      case APP.LOAD:
        var user = UserStore.getUser();

        if(!_.isEmpty(user._id)) {
          // explicitly set the collection url for the user
          this.myBevies.url = constants.apiurl + '/users/' + user._id + '/bevies';

          // trigger loading event
          this.trigger(BEVY.LOADING);

          this.myBevies.fetch({
            reset: true,
            success: function(bevies, response, options) {
              this.myBevies.sort();

              // trigger finished events
              this.trigger(BEVY.CHANGE_ALL);
              this.trigger(BEVY.LOADED);
            }.bind(this)
          });
        } else {

        }
        // load public bevies
        this.publicBevies.url = constants.apiurl + '/bevies';
        // trigger loading event
        this.trigger(BEVY.LOADING);

        this.publicBevies.fetch({
          reset: true,
          success: function(bevies, response, options) {
            this.trigger(BEVY.CHANGE_ALL);
            this.trigger(BEVY.LOADED);
          }.bind(this)
        });
        // trigger immediately anyways
        this.trigger(BEVY.CHANGE_ALL);

        break;
      case USER.LOGOUT:
        this.myBevies.reset();
        break;

      case BEVY.SWITCH:
        var bevy_id_or_slug = payload.bevy_id;
        var user = UserStore.getUser();
        this.active.url = constants.apiurl + '/bevies/' + bevy_id_or_slug;
        this.bevyInvites.url = constants.apiurl + '/bevies/' + bevy_id_or_slug + '/invites';
        this.active.fetch({
          success: function(model, response, options) {
            this.bevyBoards.url = constants.apiurl + '/bevies/' + this.active.attributes._id + '/boards';
            this.bevyInvites.url = constants.apiurl + '/bevies/' + this.active.attributes._id + '/invites';
            async.series([
              this.bevyBoards.fetch({
                success: function(collection, response, options) {
                  this.trigger(BEVY.LOADED);
                  this.trigger(BEVY.CHANGE_ALL);
                }.bind(this)
              }),
              this.bevyInvites.fetch({
                success: function(collection, response, options) {
                  this.trigger(BEVY.CHANGE_ALL);
                }.bind(this)
              })
            ])
          }.bind(this)
        })
        break;

      case BEVY.CREATE:
        var name = payload.name;
        var image = payload.image;
        var slug = payload.slug;
        var user = UserStore.getUser();
        var privacy = payload.privacy;

        // sanitize slug before we continue;
        if(_.isEmpty(slug)) {
          slug = getSlug(name);
        } else {
          // double check to make sure its url friendly
          slug = getSlug(slug);
        }

        // create and add to my bevies list
        var newBevy = this.myBevies.add({
          name: name,
          image: image,
          slug: slug,
          admins: [user._id],
          boards: [],
          settings: {
            privacy: privacy
          }
        });

        newBevy.url = constants.apiurl + '/bevies';

        // save to server
        newBevy.save(null, {
          success: function(model, response, options) {
            // success - populate fields
            newBevy.set('_id', model.get('_id'));
            newBevy.set('admins', [ user ]);
            // trigger changes for front-end
            this.trigger(BEVY.CHANGE_ALL);
            this.trigger(BEVY.CREATED, newBevy.toJSON());
          }.bind(this)
        });
        break;

      case BEVY.DESTROY:
        var bevy_id = payload.bevy_id;

        var bevy = this.myBevies.get(bevy_id);
        if(bevy == undefined) break;

        bevy.destroy({
          success: function(model, response, options) {
            this.trigger(BEVY.CHANGE_ALL);
          }.bind(this)
        });
        break;

      case BEVY.SUBSCRIBE:
        var bevy_id = payload.bevy_id;
        var bevy = this.publicBevies.get(bevy_id);
        if(bevy == undefined) return; // not found

        this.myBevies.add(bevy);
        this.trigger(BEVY.CHANGE_ALL);
        break;
      case BEVY.UNSUBSCRIBE:
        var bevy_id = payload.bevy_id;
        var bevy = this.myBevies.get(bevy_id);
        if(bevy == undefined) return;

        this.myBevies.remove(bevy_id);
        this.trigger(BEVY.CHANGE_ALL);
        break;

      case BEVY.UPDATE:
        var bevy_id = payload.bevy_id;

        var bevy = this.myBevies.get(bevy_id);
        if(bevy == undefined) break;

        var name = payload.name || bevy.get('name');
        var description = payload.description || bevy.get('description');
        var image = payload.image || bevy.get('image');
        var settings = payload.settings || bevy.get('settings');

        bevy.set({
          name: name,
          description: description,
          image: image,
          settings: settings
        });

        bevy.save({
          name: name,
          description: description,
          image: image,
          settings: settings
        }, {
          patch: true
        });

        this.trigger(BEVY.CHANGE_ALL);
        break;

      case BEVY.LEAVE:
        // remove bevy from mybevies collection
        var bevy_id = payload.bevy_id;

        var bevy = this.myBevies.get(bevy_id);
        if(bevy == undefined) break; // we havent joined yet

        this.myBevies.remove(bevy_id);
        this.trigger(BEVY.CHANGE_ALL);
        break;

      case BEVY.JOIN:
        // add bevy to mybevies collection
        var bevy_id = payload.bevy_id;
        if(this.myBevies.get(bevy_id) != undefined) break; // already joined

        // fetch new bevy from server
        var new_bevy = new Bevy;
        new_bevy.url = constants.apiurl + '/bevies/' + bevy_id;
        new_bevy.fetch({
          success: function(model, response, options) {
            // add to collection
            this.myBevies.add(new_bevy);
            this.trigger(BEVY.CHANGE_ALL);
          }.bind(this)
        });

        break;

      case BEVY.REQUEST_JOIN:
        var bevy = payload.bevy;
        var user = payload.user;

        fetch(constants.apiurl + '/notifications', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Content-Encoding': 'gzip'
          },
          body: JSON.stringify({
            event: 'bevy:requestjoin',
            bevy_id: bevy._id,
            bevy_name: bevy.name,
            user_id: user._id,
            user_name: user.displayName,
            user_image: user.image_url,
            user_email: user.email
          })
        })
        .then(res => res.json())
        .then(res => {
          if(Platform.OS === 'android') {
            ToastAndroid.show('Request Sent', ToastAndroid.SHORT);
          } else {
            // alert ios here
          }
        });
        break;

      case BEVY.ADD_USER:
        var bevy_id = payload.bevy_id;
        var user_id = payload.user_id;

        fetch(constants.apiurl + '/users/' + user_id + '/addbevy/' + bevy_id, {
          method: 'PATCH',
          body: ''
        })
        .then(res => res.json())
        .then(res => {
          this.trigger(BEVY.CHANGE_ALL);
        });
        break;

      case BEVY.SEARCH:
        var query = payload.query;
        query = encodeURIComponent(query);
        this.searchQuery = query;
        this.searchList.reset();
        this.trigger(BEVY.SEARCHING);

        if(_.isEmpty(query)) {
          // if theres no query
          // then just return public bevies
          this.searchList.reset(this.publicBevies.models);
          this.trigger(BEVY.SEARCH_COMPLETE);
          break;
        }

        this.searchList.url = constants.apiurl + '/bevies/search/' + query;
        this.searchList.fetch({
          reset: true,
          success: function(collection, response, options) {
            this.trigger(BEVY.SEARCH_COMPLETE);
          }.bind(this),
          error: function(error) {
            this.trigger(BEVY.SEARCH_ERROR, error);
          }.bind(this)
        });
        break;

      case BEVY.ADD_ADMIN:
        var bevy_id = payload.bevy_id;
        var admin = payload.admin;

        var bevy = this.myBevies.get(bevy_id);
        if(bevy == undefined) break;

        var admins = bevy.get('admins');
        admins.push(admin);
        bevy.set('admins', admins);
        bevy.save({
          admins: _.pluck(admins, '_id')
        }, {
          patch: true,
          success: function(model, response, options) {
          }
        });
        this.trigger(BEVY.CHANGE_ALL);
        break;

      case BEVY.REMOVE_ADMIN:
        var bevy_id = payload.bevy_id;
        var admin_id = payload.admin_id;

        var bevy = this.myBevies.get(bevy_id);
        if(bevy == undefined) break;

        var admins = bevy.get('admins');
        admins = _.reject(admins, admin => admin._id == admin_id);
        bevy.set('admins', admins);
        bevy.save({
          admins: _.pluck(admins, '_id')
        }, {
          patch: true,
          success: function(model, response, options) {
          }
        });
        this.trigger(BEVY.CHANGE_ALL);
        break;
      case BOARD.SWITCH_BOARD:
        var board_id = payload.board_id;
        this.activeBoard.url = constants.apiurl + '/boards/' + board_id;
        this.activeBoard.fetch({
          success: function(model, response, options) {
            this.activeBoard = model;
            this.trigger(BOARD.CHANGE_ALL);
          }.bind(this)
        })
        break;
      case BOARD.CLEAR:
        this.activeBoard = new Board;
        this.trigger(BOARD.CHANGE_ALL);
        break;
      case BOARD.CREATE:
        var name = payload.name;
        var description = payload.description;
        var image = payload.image;
        var user = UserStore.getUser();
        var type = payload.type;
        var parent_id = payload.parent_id;

        var board = new Board({
          name: name,
          description: description,
          image: image,
          admins: [user._id],
          type: type,
          parent: parent_id
        });
        board.url = constants.apiurl + '/boards';
        board.save(null, {
          success: function(model, response, options) {
            BevyStore.addBoard(board);
            UserStore.addBoard(board);
          }.bind(this)
        });
        break;
      case INVITE.INVITE_USER:
        var user = payload.user;
        var user_id = user._id;

        var invite = this.bevyInvites.add({
          user: user_id,
          type: 'bevy',
          requestType: 'invite',
          bevy: this.active.get('_id')
        });
        invite.url = constants.apiurl + '/invites';
        invite.save(null, {
          success: function(model, response, options) {
            invite.set('user', user);
            invite.set('_id', model.get('_id'));
            this.trigger(BEVY.CHANGE_ALL);
          }.bind(this)
        });
        break;
      case INVITE.DESTROY:
        console.log('got to here');
        var invite_id = payload.invite_id;
        var invite = this.bevyInvites.remove(invite_id);
        this.trigger(BEVY.CHANGE_ALL);
        if(invite == undefined)
          break;
        invite.url = constants.apiurl + '/invites/' + invite_id;
        invite.destroy();

        break;
      case INVITE.ACCEPT_REQUEST:
        var invite_id = payload.invite_id;
        fetch(constants.apiurl + '/invites/' + invite_id + '/accept')
        .then(function(data){
          this.trigger(BEVY.CHANGE_ALL);
        }.bind(this))
        break;
    }
  },

  addBoard(board) {
    this.bevyBoards.add(board);
    this.trigger(BOARD.CREATED, board.toJSON());
    this.trigger(BEVY.CHANGE_ALL);
  },

  getMyBevies() {
    if(this.myBevies == undefined) return [];
    return this.myBevies.toJSON();
  },

  getFrontpageFilters() {
    if(this.frontpageFilters == undefined) return [];
    return this.frontpageFilters;
  },

  getActiveTags() {
    return this.activeTags;
  },

  getPublicBevies() {
    if(this.publicBevies == undefined) return [];
    return this.publicBevies.toJSON();
  },

  getSearchList() {
    return (_.isEmpty(this.searchQuery))
      ? this.publicBevies.toJSON()
      : this.searchList.toJSON();
  },

  getSearchQuery() {
    return this.searchQuery;
  },

  getActive() {
    return (!_.isEmpty(this.active))
      ? this.active.toJSON()
      : {};
  },

  getActiveBoard() {
    return (!_.isEmpty(this.activeBoard))
      ? this.activeBoard.toJSON()
      : {};
  },

  getBevy(bevy_id) {
    var bevy =
      this.myBevies.get(bevy_id) ||
      this.publicBevies.get(bevy_id) ||
      this.searchList.get(bevy_id);
    return (bevy)
    ? bevy.toJSON()
    : {};
  },

  getBevyInvites() {
    return this.bevyInvites.toJSON() || [];
  },

  getBevyBoards() {
    return this.bevyBoards.toJSON() || [];
  },

  getBoard(board_id) {
    if(_.isEmpty(board_id)) {
      return {};
    }
    var board = this.bevyBoards.get(board_id);
    if(board == undefined) {
      return {};
    } else {
      // we found it so return
      return (board)
        ? board.toJSON()
        : {};
    }
  },

  getBevyImage(bevy_id, width, height) {
    var default_img = require('./../images/logo_200.png');
    if(bevy_id == -1) return default_img;
    var bevy = this.myBevies.get(bevy_id) || this.publicBevies.get(bevy_id);
    if(bevy == undefined) return default_img;
    var source = { uri: (_.isEmpty(bevy.get('image')))
      ? ''
      : bevy.get('image').path };

    if(source.uri.slice(7, 23) == 'api.joinbevy.com'
      && width != undefined
      && height != undefined) {
      source.uri += '?w=' + width + '&h=' + height;
    }
    if(_.isEmpty(source.uri)) {
      source = default_img;
    }
    return source;
  },

  addBevy(bevy) {
    this.myBevies.add(bevy);
  }
});

var dispatchToken = Dispatcher.register(BevyStore.handleDispatch.bind(BevyStore));
BevyStore.dispatchToken = dispatchToken;

module.exports = BevyStore;

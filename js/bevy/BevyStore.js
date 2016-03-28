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
var resizeImage = require('./../shared/helpers/resizeImage');
var Dispatcher = require('./../shared/dispatcher');
var getSlug = require('speakingurl');
var React = require('react-native');

var Bevies = require('./BevyCollection');
var Boards = require('./BoardCollection');
var Board = require('./BoardModel');
var UserStore = require('./../user/UserStore');
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
var APP = constants.APP;
var USER = constants.USER;
var BOARD = constants.BOARD;

var BevyActions = require('./BevyActions');
var UserStore = require('./../user/UserStore');

// inherit event class first
// VERY IMPORTANT, as the PostContainer view binds functions
// to this store's events
var BevyStore = _.extend({}, Backbone.Events);

// now add some custom functions
_.extend(BevyStore, {
  active: new Bevy,
  activeBoard: new Board,
  bevyBoards: new Boards,

  // handle calls from the dispatcher
  // these are created from BevyActions.js
  handleDispatch(payload) {
    switch(payload.actionType) {
      case APP.LOAD:
        var UserStore = require('./../user/UserStore');
        var user = UserStore.getUser();

        // trigger loading event
        this.trigger(BEVY.LOADING);

        this.active.url = constants.apiurl + '/bevies/' + user.bevy;
        this.active.fetch({
          success: function(collection, response, options) {
            this.active = new Bevy(response);
            this.trigger(BEVY.SWITCHED);
            this.bevyBoards.url = constants.apiurl + '/bevies/' + response._id + '/boards';
            this.bevyBoards.fetch({
              success: function(collection, response, options) {
                this.bevyBoards = new Boards(response);
                this.trigger(BEVY.CHANGE_ALL);
                this.trigger(BEVY.LOADED);
              }.bind(this)
            });
          }.bind(this)
        });
        break;

      case USER.LOGOUT:
        break;

      case BEVY.CREATE:
        var UserStore = require('./../user/UserStore');
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

      case BEVY.UPDATE:
        var bevy_id = payload.bevy_id;

        var bevy = this.active;

        if(!bevy_id == bevy._id)
          break;

        bevy.url = constants.apiurl + '/bevies/' + bevy._id;

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

      case BOARD.SWITCH:
        var board_id = payload.board_id;
        this.trigger(BOARD.SWITCHING);

        this.activeBoard.url = constants.apiurl + '/boards/' + board_id;
        this.activeBoard.fetch({
          success: function(model, response, options) {
            this.trigger(BOARD.SWITCHED);
            this.trigger(BOARD.CHANGE_ALL);
          }.bind(this)
        });
        break;

      case BOARD.CLEAR:
        this.activeBoard = new Board;
        this.trigger(BOARD.SWITCHED);
        this.trigger(BOARD.CHANGE_ALL);
        break;

      case BOARD.CREATE:
        var UserStore = require('./../user/UserStore');
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

            this.trigger(BOARD.CREATED, board.toJSON());
          }.bind(this)
        });
        break;

        case BOARD.UPDATE:
          var board_id = payload.board_id;
          var board = this.activeBoard;

          var name = payload.name || board.get('name');
          var description = payload.description || board.get('description');
          var image = payload.image || board.get('image');
          var settings = payload.settings || board.get('settings');

          board.url = constants.apiurl + '/boards/' + board_id;
          board.save({
            name: name,
            description: description,
            image: image,
            settings: settings
          }, {
            patch: true
          });

          board.set({
            name: name,
            description: description,
            image: image,
            settings: settings
          });
          this.trigger(BOARD.CHANGE_ALL);
          break;

      case BOARD.DESTROY:
        var board_id = payload.board_id;

        board = this.activeBoard;
        board.url = constants.apiurl + '/boards/' + board_id;
        board.destroy();

        this.activeBoard = new Board;
        this.trigger(BOARD.CHANGE_ALL);
        break;
    }
  },

  addBevy(bevy) {
    this.myBevies.add(bevy);
    this.trigger(BEVY.CHANGE_ALL);
  },

  addBoard(board) {
    this.bevyBoards.add(board);
    this.trigger(BEVY.CHANGE_ALL);
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

  getBevyImage(image, width, height) {
    var default_img = require('./../images/logo_200.png');
    if(_.isEmpty(image)) return default_img;
    var source;

    if(image.path == (constants.siteurl + '/img/logo_200.png')) {
      source = default_img;
      return source;
    } else if(image.path == '/img/logo_200.png') {
      source = default_img;
      return source;
    } else {
      source = { uri: image.path };
    }

    if(!image.foreign) {
      source = { uri: resizeImage(image, width, height).url };
    }

    return source;
  },

  getBoardImage(image, width, height) {
    var default_img = require('./../images/default_board_img.png');
    if(_.isEmpty(image)) return default_img;
    var source;

    if(image.path == (constants.siteurl + '/img/default_board_img.png')) {
      source = default_img;
      return source;
    } else if(image.path == '/img/default_board_img.png') {
      source = default_img;
      return source;
    } else {
      source = { uri: image.path };
    }

    if(!image.foreign) {
      source = { uri: resizeImage(image, width, height).url };
    }

    return source;
  }
});

var dispatchToken = Dispatcher.register(BevyStore.handleDispatch.bind(BevyStore));
BevyStore.dispatchToken = dispatchToken;

module.exports = BevyStore;

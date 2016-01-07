/**
 * BevyActions.js
 *
 * Action dispatcher for bevies
 *
 * @author albert
 */

'use strict';

// imports
var Dispatcher = require('./../shared/dispatcher');
var BEVY = require('./../constants').BEVY;
var BOARD = require('./../constants').BOARD;
var getSlug = require('speakingurl');

var BevyActions = {

  fetch(user) {
    Dispatcher.dispatch({
      actionType: BEVY.FETCH,
      user: (user == undefined) ? {} : user
    });
  },

  create(name, image, slug, privacy) {
    Dispatcher.dispatch({
      actionType: BEVY.CREATE,
      name: (name == undefined) ? '' : name,
      privacy: (privacy == undefined) ? 'Public' : privacy,
      image: (image == undefined) ? '' : image,
      slug: (slug == undefined) ? getSlug(name) : getSlug(slug) // force verification
    });
  },

  destroy(bevy_id) {
    dispatch(BEVY.DESTROY, {
      bevy_id: bevy_id
    });
  },

  update(bevy_id, name, description, image, settings) {
    Dispatcher.dispatch({
      actionType: BEVY.UPDATE,
      bevy_id: (bevy_id == undefined) ? '' : bevy_id,
      name: (name == undefined) ? null : name,
      description: (description == undefined) ? null : description,
      image: (image == undefined) ? null : image,
      settings: (settings == undefined) ? null : settings
    });
  },

  subscribe(bevy_id) {
    Dispatcher.dispatch({
      actionType: BEVY.SUBSCRIBE,
      bevy_id: bevy_id
    })
  },

  unsubscribe(bevy_id) {
    Dispatcher.dispatch({
      actionType: BEVY.UNSUBSCRIBE,
      bevy_id: bevy_id
    });
  },

  search(query) {
    Dispatcher.dispatch({
      actionType: BEVY.SEARCH,
      query: (query == undefined) ? null : query
    });
  },

  /**
   * switch bevies and update posts accordingly
   * @param  {int} id  id of bevy being switched to
   */
  switchBevy(bevy_id) {
    Dispatcher.dispatch({
      actionType: BEVY.SWITCH,
      bevy_id: (bevy_id == undefined) ? null : bevy_id
    });
  },

  requestJoin(bevy, user) {
    Dispatcher.dispatch({
      actionType: BEVY.REQUEST_JOIN,
      bevy: bevy,
      user: user
    });
  },

  addUser(bevy_id, user_id) {
    Dispatcher.dispatch({
      actionType: BEVY.ADD_USER,
      bevy_id: bevy_id,
      user_id: user_id
    });
  },

  addAdmin(bevy_id, admin) {
    Dispatcher.dispatch({
      actionType: BEVY.ADD_ADMIN,
      bevy_id: bevy_id,
      admin: admin
    });
  },

  removeAdmin(bevy_id, admin_id) {
    Dispatcher.dispatch({
      actionType: BEVY.REMOVE_ADMIN,
      bevy_id: bevy_id,
      admin_id: admin_id
    });
  },

  switchBoard(board_id) {
    Dispatcher.dispatch({
      actionType: BOARD.SWITCH_BOARD,
      board_id: board_id
    })
  },

  clearBoard() {
    Dispatcher.dispatch({
      actionType: BOARD.CLEAR
    })
  },
};

module.exports = BevyActions;

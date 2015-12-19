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
var getSlug = require('speakingurl');

var BevyActions = {

  fetch(user) {
    Dispatcher.dispatch({
      actionType: BEVY.FETCH,
      user: (user == undefined) ? {} : user
    });
  },

  create(name, description, image, slug) {
    Dispatcher.dispatch({
      actionType: BEVY.CREATE,
      name: (name == undefined) ? '' : name,
      description: (description == undefined) ? '' : description,
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

  updateTags(tags) {
    Dispatcher.dispatch({
      actionType: BEVY.UPDATE_TAGS,
      tags: (tags == undefined) ? null : tags
    });
  },

  updateFront(bevies) {
    Dispatcher.dispatch({
      actionType: BEVY.UPDATE_FRONT,
      bevies: (bevies == undefined) ? null : bevies
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

  addTag(bevy_id, name, color) {
    Dispatcher.dispatch({
      actionType: BEVY.ADD_TAG,
      bevy_id: bevy_id,
      name: name,
      color: color
    });
  },

  removeTag(bevy_id, name) {
    Dispatcher.dispatch({
      actionType: BEVY.REMOVE_TAG,
      bevy_id: bevy_id,
      name: name
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

  addRelated(bevy_id, new_bevy) {
    Dispatcher.dispatch({
      actionType: BEVY.ADD_RELATED,
      bevy_id: bevy_id,
      new_bevy: new_bevy
    });
  },

  removeRelated(bevy_id, related_id) {
    Dispatcher.dispatch({
      actionType: BEVY.REMOVE_RELATED,
      bevy_id: bevy_id,
      related_id: related_id
    });
  }
};

module.exports = BevyActions;

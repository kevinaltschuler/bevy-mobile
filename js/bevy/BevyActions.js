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

  fetchPublic() {
    Dispatcher.dispatch({
      actionType: BEVY.FETCH_PUBLIC
    });
  },

  create(name, description, image_url, slug) {
    Dispatcher.dispatch({
      actionType: BEVY.CREATE,
      name: (name == undefined) ? '' : name,
      description: (description == undefined) ? '' : description,
      image_url: (image_url == undefined) ? '' : image_url,
      slug: (slug == undefined) ? getSlug(name) : getSlug(slug) // force verification
    });
  },

  destroy(id) {
    dispatch(BEVY.DESTROY, {
      id: (id == undefined) ? '0' : id
    });
  },

  update(bevy_id, name, description, image_url, settings) {
    Dispatcher.dispatch({
      actionType: BEVY.UPDATE,
      bevy_id: (bevy_id == undefined) ? '' : bevy_id,
      name: (name == undefined) ? null : name,
      description: (description == undefined) ? null : description,
      image_url: (image_url == undefined) ? null : image_url,
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
  }
};

module.exports = BevyActions;

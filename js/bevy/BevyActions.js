/**
 * BevyActions.js
 *
 * Action dispatcher for bevies
 *
 * @author albert
 */

'use strict';

// imports
var dispatch = require('./../shared/helpers/dispatch');
var BEVY = require('./../constants').BEVY;
//var getSlug = require('speakingurl');

var BevyActions = {

  fetch(user) {
    dispatch(BEVY.FETCH, {
      user: (user == undefined) ? {} : user
    });
  },

  fetchPublic() {
    dispatch(BEVY.FETCH_PUBLIC, {});
  },

  create(name, description, image_url, slug) {
    dispatch(BEVY.CREATE, {
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
    dispatch(BEVY.UPDATE, {
      bevy_id: (bevy_id == undefined) ? '' : bevy_id,
      name: (name == undefined) ? null : name,
      description: (description == undefined) ? null : description,
      image_url: (image_url == undefined) ? null : image_url,
      settings: (settings == undefined) ? null : settings
    });
  },

  subscribe(bevy_id) {
    dispatch(BEVY.SUBSCRIBE, {
      bevy_id: bevy_id
    })
  },

  unsubscribe(bevy_id) {
    dispatch(BEVY.UNSUBSCRIBE, {
      bevy_id: bevy_id
    });
  },

  search(query) {
    dispatch(BEVY.SEARCH, {
      query: (query == undefined) ? null : query
    });
  },

  /**
   * switch bevies and update posts accordingly
   * @param  {int} id  id of bevy being switched to
   */
  switchBevy(bevy_id) {
    dispatch(BEVY.SWITCH, {
      bevy_id: (bevy_id == undefined) ? null : bevy_id
    });
  },

  updateTags(tags) {
    dispatch(BEVY.UPDATE_TAGS,{
      tags: (tags == undefined) ? null : tags
    });
  },

  updateFront(bevies) {
    dispatch(BEVY.UPDATE_FRONT,{
      bevies: (bevies == undefined) ? null : bevies
    });
  }
};

module.exports = BevyActions;

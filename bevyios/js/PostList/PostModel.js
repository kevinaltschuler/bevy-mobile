/**
 * PostModel.js
 *
 * post backbone model
 * corresponds (hopefully) with the mongoose model
 * in models/Post.js
 *
 * @author albert
 */

'use strict';

// imports
var Backbone = require('backbone');
var _ = require('underscore');

var constants = require('./../constants');

var BevyStore = require('./../BevyView/BevyStore');

// backbone model
var Post = Backbone.Model.extend({
  defaults: {
    _id: null,
    body: null,
    images: [],
    author: null,
    bevy: null,
    votes: [],
    created: new Date(),
    updated: new Date()
  },

  idAttribute: '_id',

  countVotes: function() {
    var sum = 0;
    this.get('votes').forEach(function(vote) {
      sum += vote.score;
    });
    return sum;
  }
});

module.exports = Post;

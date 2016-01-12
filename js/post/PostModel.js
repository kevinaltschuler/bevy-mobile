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

var BevyStore = require('./../bevy/BevyStore');
var UserStore = require('./../user/UserStore');

// backbone model
var Post = Backbone.Model.extend({
  idAttribute: '_id',

  initialize() {
    var user = UserStore.getUser();
    var vote = _.findWhere(this.get('votes'), { voter: user._id });
    if(vote == undefined) this.set('voted', false);
    else {
      if(vote.score <= 0) this.set('voted', false);
      else this.set('voted', true);
    }
  },

  sync(method, model, options) {
    Backbone.Model.prototype.sync.apply(this, arguments);
  },

  countVotes() {
    var sum = 0;
    this.get('votes').forEach(function(vote) {
      sum += vote.score;
    });
    return sum;
  }
});

module.exports = Post;

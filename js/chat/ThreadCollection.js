'use strict';

// imports
var Backbone = require('backbone');
var _ = require('underscore');

var Thread = require('./ThreadModel');
var constants = require('./../constants');
var UserStore = require('./../user/UserStore');

// backbone collection
var ThreadCollection = Backbone.Collection.extend({
  model: Thread, 
  // sort alphabetically by name
  comparator: thread => thread.getName().toLowerCase(),
  url: function() {
    var user = UserStore.getUser();
    return constants.apiurl + '/users/' + user._id + '/threads';
  }
});

module.exports = ThreadCollection;
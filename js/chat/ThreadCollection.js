/**
 * ThreadCollection.js
 * @author albert
 * @flow
 */

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
  comparator: thread => {
    if(thread.get('latest') == null) {
      return -(new Date(thread.get('created')));
    }
    var latest = thread.get('latest');
    return -(new Date(latest.created));
  },
  url: function() {
    var user = UserStore.getUser();
    return constants.apiurl + '/users/' + user._id + '/threads';
  }
});

module.exports = ThreadCollection;

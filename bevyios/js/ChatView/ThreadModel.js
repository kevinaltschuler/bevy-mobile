'use strict';

// imports
var Backbone = require('backbone');

var constants = require('./../constants');

var Messages = require('./MessageCollection');

// backbone model
var ThreadModel = Backbone.Model.extend({
  idAttribute: '_id',
  initialize: function() {
    this.messages = new Messages;
    this.messages.url = constants.apiurl + '/threads/' + this.id + '/messages';

    // get bevy members later
  }
});

module.exports = ThreadModel;

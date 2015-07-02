'use strict';

// imports
var Backbone = require('backbone');

var constants = require('./../constants');

// backbone model
var ThreadModel = Backbone.Model.extend({
  idAttribute: '_id'
});

module.exports = ThreadModel;

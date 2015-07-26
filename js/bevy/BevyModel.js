/**
 * BevyModel.js
 *
 * Backbone model for Bevies
 *
 * @author albert
 */

'use strict';

// imports
var Backbone = require('backbone');

var Bevies = require('./BevyCollection');
var constants = require('./../constants');

// backbone model
var BevyModel = Backbone.Model.extend({
  initialize() {
    this.bevies = new Bevies;
  },
  idAttribute: '_id'
});

module.exports = BevyModel;

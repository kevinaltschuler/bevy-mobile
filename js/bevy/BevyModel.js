/**
 * BevyModel.js
 * @author albert
 * @flow
 */

'use strict';

// imports
var Backbone = require('backbone');

var Bevies = require('./BevyCollection');
var constants = require('./../constants');

var BevyModel = Backbone.Model.extend({
  idAttribute: '_id'
});

module.exports = BevyModel;

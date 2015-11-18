/**
 * DeviceCollection.js
 * @author albert
 * @flow
 */

'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var constants = require('./../constants');

var Device = require('./DeviceModel');

var DeviceCollection = Backbone.Collection.extend({
  model: Device
});

module.exports = DeviceCollection;
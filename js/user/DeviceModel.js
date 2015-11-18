/**
 * DeviceModel.js
 * @author albert
 * @flow
 */

'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var constants = require('./../constants');

var Device = Backbone.Model.extend({
  defaults: {

  },
  idAttribute: '_id'
});

module.exports = Device;
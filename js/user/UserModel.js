/**
 * UserModel.js
 * @author albert
 * @flow
 */

'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var constants = require('./../constants');

var Devices = require('./DeviceCollection');

var User = Backbone.Model.extend({
  defaults: {
    image_url: constants.siteurl + '/img/user-profile-icon.png'
  },
  idAttribute: '_id',
  initialize() {
    this.devices = new Devices;
    this.devices.url = constants.apiurl + '/users/' + this.id + '/devices';
  }
});

module.exports = User;
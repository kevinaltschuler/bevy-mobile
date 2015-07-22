'use strict';

var Backbone = require('backbone');
var Notification = require('./NotificationModel');

var constants = require('./../constants');

var NotificationCollection = Backbone.Collection.extend({
  model: Notification
});

module.exports = NotificationCollection;
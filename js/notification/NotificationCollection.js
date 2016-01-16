/**
 * NotificationCollection.js
 * @author albert
 * @flow
 */

'use strict';

var Backbone = require('backbone');
var Notification = require('./NotificationModel');

var constants = require('./../constants');

var NotificationCollection = Backbone.Collection.extend({
  model: Notification,
  comparator: notification => {
    return -(new Date(notification.get('created')));
  }
});

module.exports = NotificationCollection;

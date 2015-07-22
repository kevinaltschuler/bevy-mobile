'use strict';

var Backbone = require('backbone');

var NotificationModel = Backbone.Model.extend({
  defaults: {

  },
  idAttribute: '_id'
});

module.exports = NotificationModel;
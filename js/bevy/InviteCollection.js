/**
 * InviteC0llection.js
 *
 * Backbone collection for Invites
 *
 * @author kevin
 */

'use strict';

var Backbone = require('backbone');

var Invite = require('./InviteModel');
var constants = require('./../constants');

var InviteCollection = Backbone.Collection.extend({
  model: Invite,
  get(id) {
    return this.find(function(invite) {
      if(invite.get('_id') == id) return true;
      return false;
    });
  },
});

module.exports = InviteCollection;

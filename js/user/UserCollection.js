/**
 * UserCollection.js
 * @author albert
 * @flow
 */

'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var constants = require('./../constants');
var User = require('./UserModel');

var Users = Backbone.Collection.extend({
  model: User
});

module.exports = Users;
/**
 * BevyCollection.js
 * @author albert
 * @flow
 */

'use strict';

// imports
var Backbone = require('backbone');
var _ = require('underscore');

var Bevy = require('./BevyModel');
var constants = require('./../constants');
var UserStore = require('./../user/UserStore');

var user = UserStore.getUser();

var BevyCollection = Backbone.Collection.extend({
	model: Bevy
});

module.exports = BevyCollection;

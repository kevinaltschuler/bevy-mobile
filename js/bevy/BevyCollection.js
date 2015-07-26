/**
 * BevyCollection.js
 *
 * Backbone collection for bevies
 *
 * @author albert
 */

'use strict';

// imports
var Backbone = require('backbone');
var _ = require('underscore');

var Bevy = require('./BevyModel');
var constants = require('./../constants');

var user = constants.getUser();

// backbone collection
module.exports = Backbone.Collection.extend({
	model: Bevy,
	_meta: {
		active: null
	}
});

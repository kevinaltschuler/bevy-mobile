/**
 * PostCollection.js
 *
 * post backbone collection
 * really just a fancy array with some CRUD functions
 *
 * @author albert
 */

'use strict';

// imports
var Backbone = require('backbone');
var _ = require('underscore');

var Post = require('./PostModel');
var constants = require('./../constants');

// backbone collection
module.exports = Backbone.Collection.extend({
	model: Post,
	comparator: '-created'
});

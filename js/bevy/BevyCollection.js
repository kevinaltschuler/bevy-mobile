/**
 * BevyCollection.js
 * @author albert
 * @flow
 */

'use strict';

var Backbone = require('backbone');
var _ = require('underscore');

var Bevy = require('./BevyModel');
var constants = require('./../constants');

var BevyCollection = Backbone.Collection.extend({
	model: Bevy
});

module.exports = BevyCollection;

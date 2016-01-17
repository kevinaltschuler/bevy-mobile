/**
 * MessageCollection.js
 * @author albert
 * @flow
 */

'use strict';

var Backbone = require('backbone');

var Message = require('./MessageModel');

var MessageCollection = Backbone.Collection.extend({
	model: Message,
	comparator: (message) => {
		return new Date(message.get('created'));
	}
});

module.exports = MessageCollection;

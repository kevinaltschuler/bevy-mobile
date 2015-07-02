'use strict';

// imports
var Backbone = require('backbone');
var _ = require('underscore');

var Dispatcher = require('./../shared/dispatcher');

var Threads = require('./ThreadCollection');

var constants = require('./../constants');
var user = constants.getUser();
var APP = constants.APP;
var CHAT = constants.CHAT;

var ChatStore = _.extend({}, Backbone.Events);

_.extend(ChatStore, {

  threads: new Threads,

	handleDispatch: function(payload) {
		switch(payload.actionType) {
      case APP.LOAD:

        console.log('fetching threads...', this.threads.url());

        this.threads.fetch({
          reset: true,
          success: function(collection, response, options) {
            console.log('fetched threads');
            this.threads.forEach(function(thread) {
              thread.messages.fetch({
                reset: true,
                success: function(collection, response, options) {
                  console.log('fetched messages');
                  thread.messages.sort();
                  console.log(thread.toJSON());
                  this.trigger(CHAT.CHANGE_ALL);
                }.bind(this)
              });
            }.bind(this));
          }.bind(this)
        });

        break;
    }
	},

  getAll: function() {
    return this.threads.toJSON();
  },

  getMessages: function(thread_id) {
    var thread = this.threads.get(thread_id);
    if(thread == undefined) return [];
    else return thread.messages.toJSON();
  }
});

var dispatchToken = Dispatcher.register(ChatStore.handleDispatch.bind(ChatStore));
ChatStore.dispatchToken = dispatchToken;

module.exports = ChatStore;
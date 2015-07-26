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

        this.threads.fetch({
          reset: true,
          success: function(collection, response, options) {
            //this.trigger(APP.LOAD_PROGRESS, 0.1);
            this.threads.forEach(function(thread) {
              thread.messages.fetch({
                reset: true,
                success: function(collection, response, options) {
                  thread.messages.sort();
                  //console.log(thread.toJSON());
                  //this.trigger(APP.LOAD_PROGRESS, (0.1 / this.threads.length));
                  this.trigger(CHAT.CHANGE_ALL);
                }.bind(this)
              });
            }.bind(this));
          }.bind(this)
        });

        break;

      case CHAT.FETCH_MORE:
        var thread_id = payload.thread_id;
        var thread = this.threads.get(thread_id);

        if(thread == undefined) break;

        var message_count = thread.messages.length;
        var temp_url = thread.messages.url;
        thread.messages.url += ('?skip=' + message_count);

        thread.messages.fetch({
          remove: false,
          success: function(collection, response, options) {
            thread.messages.sort();
            this.trigger(CHAT.CHANGE_ONE + thread_id);
          }.bind(this)
        });
        // reset url
        thread.messages.url = temp_url;

        break;

      case CHAT.POST_MESSAGE:
        var thread_id = payload.thread_id;
        var author = payload.author;
        var body = payload.body;

        var thread = this.threads.get(thread_id);

        if(thread == undefined) break;

        var message = thread.messages.add({
          thread: thread_id,
          author: author._id,
          body: body
        });
        message.save(null, {
          success: function(model, response, options) {
            message.set('_id', model.get('_id'));
            message.set('author', model.get('author'));
            message.set('created', model.get('created'));
            this.trigger(CHAT.CHANGE_ONE + thread_id);
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
  },

  addMessage: function(message) {
    console.log('adding message...');
    var thread = this.threads.get(message.thread);
    if(thread == undefined) return;
    thread.messages.add(message);
    thread.messages.sort();
    //this.trigger(CHAT.CHANGE_ALL);
    this.trigger(CHAT.CHANGE_ONE + thread.id);
  }
});

var dispatchToken = Dispatcher.register(ChatStore.handleDispatch.bind(ChatStore));
ChatStore.dispatchToken = dispatchToken;

module.exports = ChatStore;
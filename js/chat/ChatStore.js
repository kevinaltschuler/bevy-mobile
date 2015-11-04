'use strict';

// imports
var Backbone = require('backbone');
var _ = require('underscore');

var Dispatcher = require('./../shared/dispatcher');

var Threads = require('./ThreadCollection');
var Thread = require('./ThreadModel');

var constants = require('./../constants');
var UserStore = require('./../user/UserStore');
var user = UserStore.getUser();
var APP = constants.APP;
var CHAT = constants.CHAT;
var BEVY = constants.BEVY;

var ChatStore = _.extend({}, Backbone.Events);

_.extend(ChatStore, {

  threads: new Threads,
  active: -1,

	handleDispatch(payload) {
		switch(payload.actionType) {
      case APP.LOAD:
        if(UserStore.loggedIn) {
          this.threads.fetch({
            reset: true,
            success: function(collection, response, options) {
              //console.log('threads fetched', this.threads.toJSON());
              this.threads.forEach(function(thread) {
                thread.messages.fetch({
                  reset: true,
                  success: function(collection, response, options) {
                    thread.messages.sort();
                    this.trigger(CHAT.CHANGE_ALL);
                  }.bind(this)
                });
              }.bind(this));
            }.bind(this)
          });
        }

        break;

      case BEVY.SWITCH:
        var bevy_id = payload.bevy_id;

        var thread = this.threads.find(function($thread) {
          if(_.isEmpty($thread.get('bevy'))) return false; // skip over PMs
          return $thread.get('bevy')._id == bevy_id;
        });

        if(thread == undefined) this.active = -1; // thread not found
        else this.active = thread.get('_id');

        this.trigger(CHAT.CHANGE_ALL);

        break;

      case BEVY.SUBSCRIBE:
        // add the group chat of the subscribed bevy
        var bevy_id = payload.bevy_id;

        var new_thread = new Thread;
        new_thread.url = constants.apiurl + '/bevies/' + bevy_id + '/thread';
        new_thread.fetch({
          success: function(model, response, options) {
            this.threads.add(model);
            this.trigger(CHAT.CHANGE_ALL);
          }.bind(this)
        });

        break;
      case BEVY.UNSUBSCRIBE:
        // remove the group chat of the unsubscribed bevy
        var bevy_id = payload.bevy_id;

        var thread = this.threads.find(function($thread) {
          if(_.isEmpty($thread.get('bevy'))) return false; // skip over PMs
          return $thread.get('bevy')._id == bevy_id;
        });

        if(thread == undefined) break;
        this.threads.remove(thread);

        this.trigger(CHAT.CHANGE_ALL);
        break;

      case CHAT.SWITCH:
        var thread_id = payload.thread_id;
        this.active = thread_id;
        this.trigger(CHAT.CHANGE_ALL);
        break;

      case CHAT.CREATE_THREAD_AND_MESSAGE:
        var addedUsers = payload.addedUsers;
        var messageBody = payload.messageBody;
        var user = UserStore.getUser();

        // add self to user list
        addedUsers.push(user);

        // remove duplicate users
        _.uniq(addedUsers);

        // check to see if this thread already exists
        var duplicate = this.threads.find(function($thread) {
          return (
            _.difference(
              _.pluck(addedUsers, '_id'), 
                _.pluck($thread.get('users'), '_id')
            ).length <= 0)
            && addedUsers.length == $thread.get('users').length;
        });

        // only dont create a new thread if this is a pm 
        // allow for duplicate group chats
        if(duplicate != undefined && addedUsers.length <= 2) {
          // if we find a duplicate thread
          // push the message
          var newMessage = duplicate.messages.add({
            thread: duplicate.get('_id'),
            author: user._id,
            body: messageBody
          });
          newMessage.save();
          // self populate message
          newMessage.set('author', user);

          // switch to the new thread
          this.active = duplicate.get('_id');
          this.trigger(CHAT.CHANGE_ALL);
          this.trigger(CHAT.SWITCH_TO_THREAD, duplicate.get('_id'));
          break;
        }

        // duplicate not found
        // create thread
        var thread = this.threads.add({
          type: (addedUsers.length > 2) ? 'group' : 'pm', // if more than 2 users (including self), then label as a group chat
          users: _.pluck(addedUsers, '_id') // only push _ids to server
        });
        thread.url = constants.apiurl + '/threads';
        thread.save(null, {
          success: function(model, response, options) {
            // open the new thread and self populate
            thread.set('_id', model.get('_id'));
            thread.set('users', addedUsers);

            // push and save the new message
            var newMessage = thread.messages.add({
              thread: thread.get('_id'),
              author: user._id,
              body: messageBody
            });

            // set the urls
            thread.url = constants.apiurl + '/threads/' + thread.get('_id');
            thread.messages.url = constants.apiurl + '/threads/' + 
              thread.get('_id') + '/messages';
            newMessage.save();

            // self populate message
            newMessage.set('author', user);

            // open thread
            this.active = thread.get('_id');
            this.trigger(CHAT.CHANGE_ALL);
            this.trigger(CHAT.SWITCH_TO_THREAD, thread.get('_id'));
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

  getAll() {
    return this.threads.toJSON();
  },

  getActive() {
    if(this.active == -1) return {};
    var thread = this.threads.get(this.active);
    if(thread == undefined) return {};
    return thread.toJSON();
  },
  getThreadName(thread_id) {
    var thread = this.threads.get(thread_id);
    if(thread == undefined) return 'thread not found';
    return thread.getName();
  },
  getThreadImageURL(thread_id) {
    var thread = this.threads.get(thread_id);
    if(thread == undefined) return '/img/logo_100.png';
    return thread.getImageURL();
  },
  getMessages(thread_id: String) {
    var thread = this.threads.get(thread_id);
    if(thread == undefined) return [];
    else return thread.messages.toJSON();
  },

  getLatestMessage(thread_id: String) {
    var thread = this.threads.get(thread_id);
    if(thread == undefined) return {};
    var message = thread.messages.last();
    if(!_.isEmpty(message)) return message.toJSON();
    else return {};
  },

  addMessage(message: Object) {
    //console.log('adding message...');
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
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

      case CHAT.ADD_USERS:
        var thread_id = payload.thread_id;
        var users = payload.users;

        var thread = this.threads.get(thread_id);
        if(thread == undefined) break;
        // dont add users to bevy threads. shouldnt happen anyways
        if(thread.get('type') == 'bevy') break;

        // merge user lists
        var thread_users = thread.get('users');
        thread_users = _.union(thread_users, users);

        if(thread.get('type') == 'pm') {
          // keep the pm and create a new group chat thread
          var thread = this.threads.add({
            type: 'group',
            users: _.pluck(thread_users, '_id')
          });
          thread.url = constants.apiurl + '/threads';
          thread.save(null, {
            success: function(model, response, options) {
              //self populate
              thread.set('_id', model.get('_id'));
              thread.set('users', thread_users);
              // set the urls
              thread.url = constants.apiurl + '/threads/' + thread.get('_id');
              thread.messages.url = 
                constants.apiurl + '/threads/' + thread.get('_id') + '/messages';

              this.active = thread.get('_id');
              this.trigger(CHAT.CHANGE_ALL);
              this.trigger(CHAT.SWITCH_TO_THREAD, thread.get('_id'));
            }.bind(this)
          });
        } else {
          // just add the user and save to server
          thread.save({
            users: _.pluck(thread_users, '_id')
          }, {
            patch: true,
            success: function(model, response, options) {
            }.bind(this)
          });
          // simulate population of users field
          thread.set('users', thread_users);
          this.trigger(CHAT.CHANGE_ALL);
        }
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

      case CHAT.REMOVE_USER:
        var thread_id = payload.thread_id;
        var user_id = payload.user_id;
        var user = UserStore.getUser();

        var thread = this.threads.get(thread_id);
        if(thread == undefined) break;

        // remove user 
        var thread_users = _.reject(thread.get('users'), function($user) {
          return $user._id == user_id;
        });
        if(thread_users.length == thread.get('users').length) break; // nothing changed

        // save to server
        thread.save({
          users: _.pluck(thread_users, '_id')
        }, {
          patch: true,
          success: function(model, response, options) {
          }.bind(this)
        });

        // simulate population of users field
        thread.set('users', thread_users);
        if(user_id == user._id) {
          // if you're removing yourself, then remove the thread from our list
          this.threads.remove(thread_id);
        }
        this.trigger(CHAT.CHANGE_ALL);
        break;

      case CHAT.DELETE_THREAD:
        var thread_id = payload.thread_id;

        var thread = this.threads.remove(thread_id);
        if(thread == undefined) break;

        thread.url = constants.apiurl + '/threads/' + thread.get('_id');
        thread.destroy({
          success: function(model, response, options) {
            this.trigger(CHAT.CHANGE_ALL);
          }.bind(this)
        });
        break;

      case CHAT.EDIT_THREAD:
        var thread_id = payload.thread_id;

        var thread = this.threads.get(thread_id);
        if(thread == undefined) break;

        var name = payload.name || thread.get('name');
        var image_url = payload.image_url || thread.get('image_url');

        var tempBevy = thread.get('bevy');
        var tempUsers = thread.get('users');

        thread.save({
          name: name,
          image_url: image_url
        }, {
          patch: true,
          success: function(model, response, options) {
            // repopulate
            thread.set('users', tempUsers);
            thread.set('bevy', tempBevy);
            this.trigger(CHAT.CHANGE_ALL);
          }.bind(this)
        });
        break;

      case CHAT.START_PM:
        var user_id = payload.user_id;
        var my_id = UserStore.getUser()._id;

        // dont allow chatting with self
        if(user_id == my_id) break;

        // try to find a preexisting PM
        var thread = this.threads.find(function($thread) {
          var $users = $thread.get('users');
          if($thread.get('type') != 'pm') return false;
          if(_.findWhere($users, { _id: user_id }) == undefined) return false;
          return true;
        });

        // if it doesnt exist yet
        if(thread == undefined) {
          console.log('existing thread does not exist. creating new one...');
          // create thread
          thread = this.threads.add({
            type: 'pm',
            users: [user_id, my_id]
          });
          // save to server
          thread.url = constants.apiurl + '/threads';
          thread.save(null, {
            success: function(model, response, options) {
              console.log('created new pm thread', model.get('_id'));
              thread.set('_id', model.id);
              // set the messages url
              thread.messages.url
                 = constants.apiurl + '/threads/' + model.get('_id') + '/messages';
              // set to active and go to thread
              this.active = model.get('_id');
              this.trigger(CHAT.CHANGE_ALL);
              this.trigger(CHAT.SWITCH_TO_THREAD, model.get('_id'));
            }.bind(this)
          });
        } else {
          console.log('found existing thread', thread.get('_id'));
          // set it to active and switch to it
          this.active = thread.get('_id');
          this.trigger(CHAT.CHANGE_ALL);
          this.trigger(CHAT.SWITCH_TO_THREAD, thread.get('_id'));
        }
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
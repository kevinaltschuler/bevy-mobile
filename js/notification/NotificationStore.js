/**
 * NotificationStore.js
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  VibrationIOS,
  Platform,
  Push,
  PushNotificationIOS,
  AlertIOS
} = React;
var GCM = require('./../shared/apis/GCM.android.js');
//var VibrationAndroid = (Platform.OS == 'android')
//  ? require('react-native-vibration')
//  : {};
//var AudioPlayer = (Platform.OS == 'android')
//  ? require('react-native-audioplayer')
//  : {};
//

var Backbone = require('backbone');
var _ = require('underscore');
var Dispatcher = require('./../shared/dispatcher');
var constants = require('./../constants');
var NOTIFICATION = constants.NOTIFICATION;
var APP = constants.APP;
var ChatStore = require('./../chat/ChatStore');
var UserStore = require('./../user/UserStore');
var Notifications = require('./NotificationCollection');

// polyfill for socket.io
window.navigator.__defineGetter__('userAgent', function(){
  return 'react-native' // customized user agent
});

var io = require('socket.io-client/socket.io');

var NotificationStore = _.extend({}, Backbone.Events);
_.extend(NotificationStore, {

  notifications: new Notifications,
  unread: 0,
  ws: null,
  initialNote: {},

  handleDispatch: function(payload) {
    switch(payload.actionType) {
      case APP.LOAD:
        if(!UserStore.loggedIn) {
          break;
        }
        var user = UserStore.getUser();

        this.notifications.comparator = this.sortByNew;
        this.notifications.url =
          constants.apiurl + '/users/' + user._id + '/notifications';

        this.trigger(NOTIFICATION.FETCHING);

        this.notifications.fetch({
          reset: true,
          success: function(collection, response, options) {
            // count all notifications that are unread
            this.updateUnread();

            this.notifications.sort()

            this.trigger(NOTIFICATION.FETCHED);
            this.trigger(NOTIFICATION.CHANGE_ALL);
          }.bind(this)
        });

        // if websockets have already been initialized
        // then break out here.
        if(this.ws) break;

        this.ws = io(constants.siteurl, { jsonp: false });

        this.ws.on('error', function(error) {
          console.log('error', error);
        });
        this.ws.on('connect', function() {
          console.log('websocket client connected');
          console.log('setting user id', user._id);
          this.ws.emit('set_user_id', user._id);
        }.bind(this));

        this.ws.on('chat.' + user._id, function(message) {
          message = JSON.parse(message);

          // TODO: play audio
          if(Platform.OS == 'android') {
            //AudioPlayer.play('notification.mp3');
          } else if (Platform.OS == 'ios') {

          }

          // vibrate
          if(Platform.OS == 'android') {
            //VibrationAndroid.vibrate(500);
          } else if (Platform.OS == 'ios') {
            VibrationIOS.vibrate();
          }

          if(ChatStore.addMessage != undefined)
            ChatStore.addMessage(message);
        }.bind(this));

        this.ws.on('notification.' + user._id, function(notification) {
          console.log('ws got notification', notification);
          this.notifications.add(notification);
          this.trigger(NOTIFICATION.CHANGE_ALL);
        }.bind(this));

        break;

      case NOTIFICATION.FETCH:
        var user = UserStore.getUser();

        this.notifications.url =
          constants.apiurl + '/users/' + user._id + '/notifications';
        this.notifications.comparator = this.sortByNew;

        this.trigger(NOTIFICATION.FETCHING);

        this.notifications.fetch({
          success: function(collection, response, options) {
            // count all notifications that are unread
            this.updateUnread();

            this.notifications.sort();
            this.trigger(NOTIFICATION.FETCHED);
            this.trigger(NOTIFICATION.CHANGE_ALL);
          }.bind(this)
        });
        break;

      case NOTIFICATION.DISMISS:
        var id = payload.id;

        var notification = this.notifications.get(id);
        if(notification == undefined) break;

        notification.url = constants.apiurl + '/notifications/' + notification.get('_id');
        notification.destroy();
        this.trigger(NOTIFICATION.CHANGE_ALL);
        break;

      case NOTIFICATION.READ:
        var id = payload.id;
        var notification = this.notifications.get(id);
        if(notification == null) {
          console.log('note not found');
          break;
        }
        this.unread -= 1;
        notification.url = constants.apiurl + '/notifications/' + notification.get('_id');
        notification.save({ read: true }, { patch: true });
        notification.set('read', true);
        this.trigger(NOTIFICATION.CHANGE_ALL);
        break;

      case NOTIFICATION.DISMISS_ALL:
        this.notifications.forEach(function(notification) {
          notification.destroy();
        });
        this.trigger(NOTIFICATION.CHANGE_ALL);
        break;

      case NOTIFICATION.REGISTER:
        var token = payload.token;
        var user_id = payload.user_id;

        if(_.isEmpty(token) || _.isEmpty(user_id)) {
          console.log('somethings wrong');
          break;
        }
        if(Platform.OS == 'ios') {
          console.log('good stuff');
          fetch(constants.apiurl + '/users/'+ user_id + '/devices', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token: token,
              platform: 'ios'
            })
          });
        }
        break;

      case NOTIFICATION.SET_INITIAL:
        var note = payload.note.getData();
        this.initialNote = note;
        break;

      case NOTIFICATION.CLEAR_INITIAL:
        this.initialNote = {};
        break;
    }
  },

  updateUnread() {
    this.unread = this.notifications.filter(
      notification => notification.get('read') == false
    ).length;
  },

  sortByNew(note) {
    var date = Date.parse(note.get('created'));
    return -date;
  },

  getAll() {
    return this.notifications.toJSON();
  },

  getUnread() {
    return this.unread;
  },

  getInitialNote() {
    return this.initialNote;
  },
});

if(Platform.OS == 'android') {
  GCM.addEventListener('notification', function(data) {
    console.log('got remote notification', data);
  });
}

var dispatchToken = Dispatcher.register(NotificationStore.handleDispatch.bind(NotificationStore));
NotificationStore.dispatchToken = dispatchToken;

module.exports = NotificationStore;

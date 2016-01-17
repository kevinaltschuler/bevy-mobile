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
            this.unread = this.notifications.filter(
              (notification) => notification.read == false).length;

            this.notifications.sort()

            this.trigger(NOTIFICATION.FETCHED);
            this.trigger(NOTIFICATION.CHANGE_ALL);
          }.bind(this)
        });

        var ws = io(constants.siteurl, { jsonp: false });

        ws.on('error', function(error) {
          console.log(error);
          console.log('error');
        });
        ws.on('connect', function() {
          console.log('websocket client connected');
          console.log('setting user id', user._id);
          ws.emit('set_user_id', user._id);
        });

        ws.on('chat.' + user._id, function(message) {
          message = JSON.parse(message);
          console.log('ws got message', message);

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

          ChatStore.addMessage(message);
        }.bind(this));

        ws.on('notification.' + user._id, function(notification) {
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
            this.unread = this.notifications.filter(
              (notification) => notification.read == false).length;

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
        notification.read = true;
        this.unread -= 1;
        notification.save({read: true}, {patch: true});
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
          fetch(constants.apiurl + '/users/'+ user_id +'/devices', {
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
    }
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
  }
});

if(Platform.OS == 'android') {
  GCM.addEventListener('notification', function(data) {
    console.log('got remote notification', data);
  });
}

var dispatchToken = Dispatcher.register(NotificationStore.handleDispatch.bind(NotificationStore));
NotificationStore.dispatchToken = dispatchToken;

module.exports = NotificationStore;

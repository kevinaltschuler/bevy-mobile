'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var {
  VibrationIOS
} = require('react-native');

var Dispatcher = require('./../shared/dispatcher');

var constants = require('./../constants');
var NOTIFICATION = constants.NOTIFICATION;
var APP = constants.APP;

var ChatStore = require('./../chat/ChatStore');
var UserStore = require('./../user/UserStore');

var Notifications = require('./NotificationCollection');

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

        this.notifications.url = constants.apiurl + '/users/' + UserStore.getUser()._id + '/notifications';

        this.notifications.fetch({
          reset: true,
          success: function(collection, response, options) {
            this.trigger(NOTIFICATION.CHANGE_ALL);
            this.unread = this.notifications.filter(function(notification){ return notification.read == false; })
            .length; // count all notifications that are unread
          }.bind(this)
        });

        /*--- LONG POLL  --*/

        this.MAX_WAITING_TIME = 15000;// in ms

        var getJSON = function(params) {
          //console.log('start long poll');

          var wrappedPromise = {};
          var promise = new Promise(function (resolve, reject) {
            wrappedPromise.resolve = resolve;
            wrappedPromise.reject = reject;
          });
          wrappedPromise.then = promise.then.bind(promise);
          wrappedPromise.catch = promise.catch.bind(promise);
          wrappedPromise.promise = promise;// e.g. if you want to provide somewhere only promise, without .resolve/.reject/.catch methods

          fetch(params.url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json'
            }
          })
          .then(function(response) {
            wrappedPromise.resolve(response);
          }, function(error) {
            wrappedPromise.reject(error);
          })
          .catch(function(error) {
            wrappedPromise.catch(error);
          });

          this.timeoutId = setTimeout(function () {
            //console.log('timeout');
            // reject on timeout
            wrappedPromise.reject(new Error('Load timeout for resource: ' + params.url)); 
          }, this.MAX_WAITING_TIME);

          return wrappedPromise.promise
            .then(function(response) {
              clearTimeout(this.timeoutId);
              return response;
            }.bind(this))
            .then(function(response) {
              if (response.status === 200 || response.status === 0) {
                return Promise.resolve(response)
              } else {
                return Promise.reject(new Error(response.statusText))
              }
            })
            .then(function(response) {
              return response.json();
            });
        }.bind(this);

        (function poll() {
          getJSON({
            url: constants.apiurl + '/users/' + UserStore.getUser()._id + '/notifications/poll'
          }).then(function(response) {
            // on success
            poll();
            //console.log('JSON parsed successfully!');
            console.log(response);

            // play audio/vibrate phone
            switch(response.type) {
              case 'message':
                ChatStore.addMessage(response.data);
                VibrationIOS.vibrate();
                break;
              case 'notification':
                this.notifications.add(response.data);
                this.trigger(NOTIFICATION.CHANGE_ALL);
                break;
              default:
                break;
            }

          }.bind(this), function(error) {
            // on reject
            poll();
            //console.error('An error occured!');
            //console.error(error.message ? error.message : error);
          });
        })();

        break;

      case APP.UNLOAD:
        //clearTimeout(this.timeoutId);
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
    }
  },

  getAll: function() {
    return this.notifications.toJSON();
  }
});



var dispatchToken = Dispatcher.register(NotificationStore.handleDispatch.bind(NotificationStore));
NotificationStore.dispatchToken = dispatchToken;

module.exports = NotificationStore;
/**
 * GCM.android.js
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  NativeModules,
  Platform,
  DeviceEventEmitter
} = React;
var Map = require('Map');
var invariant = require('invariant');
var _notifHandlers = new Map();

var DEVICE_NOTIF_EVENT = 'remoteNotificationReceived';
var NOTIF_REGISTER_EVENT = 'remoteNotificationsRegistered';

var GCM = {};
if(Platform.OS == 'android') {
  GCM = NativeModules.GCM;
} else {
}

class GcmAndroid {
  constructor(data) {
    this.data = data;
  }
  
  static addEventListener(type: String, handler: Function) {
    invariant(
      type === 'notification' || type === 'register',
      'GcmAndroid only supports the notification and register events'
    );
    var listener;
    if(type === 'notification') {
      listener = DeviceEventEmitter.addListener(
        DEVICE_NOTIF_EVENT,
        notifData => {
          var data = JSON.parse(notifData.dataJSON);
          handler(new GcmAndroid(data));
        }
      );
    } else if (type === 'register') {
      listener = DeviceEventEmitter.addListener(
        NOTIF_REGISTER_EVENT,
        registrationInfo => {
          handler(registrationInfo.deviceToken);
        }
      );
    }
    _notifHandlers.set(handler, listener);
  }

  static register(callback: Function) {
    GCM.register(callback);
  }

  static abandonPermissions() {

  }

  static checkPermissions(callback: Function) {

  }

  static removeEventListener(type: String, handler: Function) {
    invariant(
      type === 'notification' || type === 'register',
      'GcmAndroid only supports the notification and register events'
    );
    var listener = _notifHandlers.get(handler);
    if(!listener) return;
    listener.remove();
    _notifHandlers.delete(handler); 
  }
}


module.exports = GcmAndroid;
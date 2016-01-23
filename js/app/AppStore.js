/**
 * AppStore.js
 * @author albert
 * @flow
 */

'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var Dispatcher = require('./../shared/dispatcher');
var React = require('react-native');
var {
  Platform,
  ToastAndroid
} = React;

var constants = require('./../constants');
var APP = constants.APP;

var AppStore = _.extend({}, Backbone.Events);
_.extend(AppStore, {

  handleDispatch(payload) {
    switch(payload.actionType) {
    }
  }
});

var dispatchToken = Dispatcher.register(AppStore.handleDispatch.bind(AppStore));
AppStore.dispatchToken = dispatchToken;

module.exports = AppStore;

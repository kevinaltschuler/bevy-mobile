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
  searchType: 'bevy',

  handleDispatch(payload) {
    switch(payload.actionType) {
      case APP.SWITCH_SEARCH_TYPE:
        this.searchType = payload.type;
        this.trigger(APP.CHANGE_ALL);
        break;
    }
  },

  getSearchType() {
    return this.searchType;
  }
});

var dispatchToken = Dispatcher.register(AppStore.handleDispatch.bind(AppStore));
AppStore.dispatchToken = dispatchToken;

module.exports = AppStore;
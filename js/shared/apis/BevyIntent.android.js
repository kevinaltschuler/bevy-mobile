/**
 * BevyIntent.android.js
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  Platform,
  NativeModules
} = React;

var BevyIntent = {};

if(Platform.OS == 'android') {
  BevyIntent = NativeModules.BevyIntent;
}

module.exports = BevyIntent;
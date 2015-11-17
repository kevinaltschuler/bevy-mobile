/**
 * GCM.android.js
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  NativeModules,
  Platform
} = React;

var GCM = {};

if(Platform.OS == 'android') {
  GCM = NativeModules.GCM;
} else {

}

module.exports = GCM;
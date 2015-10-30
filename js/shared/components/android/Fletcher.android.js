/**
 * @providesModule Fletcher
 */

'use strict';

var React = require('react-native');
var { 
  NativeModules,
  Platform
} = React;

var Fletcher = {};

if(Platform.OS == 'android') {
  Fletcher = NativeModules.Fletcher
} else {
  Fletcher = {};
}

module.exports = Fletcher;
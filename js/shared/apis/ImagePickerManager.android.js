/**
 * ImagePickerManager.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  NativeModules
} = React;

var {
  UIImagePickerManager: ImagePickerManager
} = NativeModules;

module.exports = ImagePickerManager;
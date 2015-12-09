'use strict';

var Dispatcher = require('./../shared/dispatcher');
var constants = require('./../constants');
var FILE = constants.FILE;

var FileActions = {
  upload(uri: String) {
    Dispatcher.dispatch({
      actionType: FILE.UPLOAD,
      uri: uri
    });
  }
};

module.exports = FileActions;
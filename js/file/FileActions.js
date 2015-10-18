'use strict';

var constants = require('./../constants');
var FILE = constants.FILE;

var FileActions = {
  upload(uri: String) {
    dispatch(FILE.UPLOAD, {
      uri: uri
    });
  }
};

module.exports = FileActions;
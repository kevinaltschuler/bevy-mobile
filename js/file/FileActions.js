'use strict';

var dispatch = require('./../shared/helpers/dispatch');
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
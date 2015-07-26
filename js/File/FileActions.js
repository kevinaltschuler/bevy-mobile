'use strict';

var dispatch = require('./../shared/helpers/dispatch');
var constants = require('./../constants');
var FILE = constants.FILE;

var FileActions = {
  upload(data : String, url: String) {
    dispatch(FILE.UPLOAD, {
      data: data,
      url: url
    });
  }
};

module.exports = FileActions;
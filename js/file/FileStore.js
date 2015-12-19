'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var {
  StatusBarIOS,
  Platform
} = require('react-native');

var Dispatcher = require('./../shared/dispatcher');
var constants = require('./../constants');
var FILE = constants.FILE;
var FileTransfer = require('NativeModules').FileTransfer;

var FileStore = _.extend({}, Backbone.Events);
_.extend(FileStore, {
  handleDispatch(payload : Object) {
    switch(payload.actionType) {
      case FILE.UPLOAD:
        var uri = payload.uri;
        this.upload(uri);
        break;
    }
  },

  upload(uri: String) {
    console.log('sending multipart request...');
    FileTransfer.upload({
      uri: uri, 
      uploadUrl: constants.apiurl + '/files/upload',
      fileName: 'temp.jpg',
      mimeType: 'image/jpg',
      headers: {
        'Accept': 'application/json'
      },
      data: {
        // whatever properties you wish to send in the request
        // along with the uploaded file
      }
    }, (err, res) => {
      console.log('RESPONSE', err, res);
      // make sure the status bar is still white
      if(Platform.OS === 'ios') {
        StatusBarIOS.setStyle(1);
      }
      if(Platform.OS == 'ios') {
        var file = res.data;
        file = JSON.parse(file);
      } else {
        var file = JSON.parse(res);
      }
      if(err) {
        this.trigger(FILE.UPLOAD_ERROR, err);
        return;
      }
      // populate path
      file.path = constants.apiurl + '/files/' + file.filename;
      this.trigger(FILE.UPLOAD_COMPLETE, file);
      // make sure the status bar is still white
      if(Platform.OS === 'ios') {
        StatusBarIOS.setStyle(1);
      }
    });
  }
});

var dispatchToken = Dispatcher.register(FileStore.handleDispatch.bind(FileStore));
FileStore.dispatchToken = dispatchToken;

module.exports = FileStore;

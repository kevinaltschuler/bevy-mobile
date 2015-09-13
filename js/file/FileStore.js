'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var {
  StatusBarIOS
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
        this.upload(uri, (err, filename) => {
          if(err) {
            this.trigger(FILE.UPLOAD_ERROR, err);
            return;
          }
          this.trigger(FILE.UPLOAD_COMPLETE, filename);
          // make sure the status bar is still white
          StatusBarIOS.setStyle(1);
        });

        break;
    }
  },

  upload(uri: String, callback: Function) {
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
      // make sure the status bar is still white
      StatusBarIOS.setStyle(1);

      if(err) callback(err, null);
      var data = JSON.parse(res.data);
      var filename = constants.apiurl + '/files/' + data.filename;
      callback(null, filename);
    });
  }
});

var dispatchToken = Dispatcher.register(FileStore.handleDispatch.bind(FileStore));
FileStore.dispatchToken = dispatchToken;

module.exports = FileStore;
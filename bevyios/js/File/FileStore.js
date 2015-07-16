'use strict';

var Backbone = require('backbone');
var _ = require('underscore');

var Dispatcher = require('./../shared/dispatcher');
var constants = require('./../constants');
var FILE = constants.FILE;

var FileStore = _.extend({}, Backbone.Events);
_.extend(FileStore, {
  handleDispatch(payload : Object) {
    switch(payload.actionType) {
      case FILE.UPLOAD:
        /*var blob = new Blob([payload.data], { type: 'image/jpeg'});
        var formData = new FormData();
        formData.append('filename', 'file.jpeg');
        formData.append('file', blob);
        console.log(formData);*/

        /*fetch(constants.apiurl + '/files/upload', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          //body: formData
          body: JSON.stringify({
            filename: 'file.jpeg',
            file: payload.data
          })
        })
        .then((response) => {
          console.log(response);
        });*/

        break;
    }
  }
});

var dispatchToken = Dispatcher.register(FileStore.handleDispatch.bind(FileStore));
FileStore.dispatchToken = dispatchToken;

module.exports = FileStore;

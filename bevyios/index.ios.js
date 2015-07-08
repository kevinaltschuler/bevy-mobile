/**
 * the bevy ios app
 * made by kevin for the SUB-OHM ARMY 
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Text,
  View,
  Navigator
} = React;

var MainView = require('./js/app/components/MainView.ios.js');

var Backbone = require('backbone');
var _ = require('underscore');

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 0,
  },
});

var Backbone = require('backbone');
Backbone.sync = function(method, model, options) {

  var headers = {
    'Accept': 'application/json'
  };
  var body = '';

  var url = model.url;
  if (!options.url) {
    url = _.result(model, 'url');
  } else {
    url = options.url;
  }

  if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(options.attrs || model.toJSON(options));
  }

  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'patch':  'PATCH',
    'delete': 'DELETE',
    'read':   'GET'
  };
  method = methodMap[method];

  return fetch(url, {
    method: method,
    headers: headers,
    body: body
  })
  .then(res => {
    var response = JSON.parse(res._bodyText);

    //console.log('model', model);
    //console.log('response', response);
    //console.log('options', options);

    options.success(response, options);
  });
}

var constants = require('./js/constants');
var BEVY = constants.BEVY;
var POST = constants.POST;

var BevyStore = require('./js/BevyView/BevyStore');
var PostStore = require('./js/PostList/PostStore');
var CHAT = constants.CHAT;
var ChatStore = require('./js/ChatView/ChatStore');

var bevyios = React.createClass({

  getInitialState: function() {
    return {
      allBevies: BevyStore.getAll(),
      activeBevy: BevyStore.getActive(),
      allPosts: PostStore.getAll(),
      allThreads: ChatStore.getAll()
    };
  },

  componentDidMount: function() {
    BevyStore.on(BEVY.CHANGE_ALL, this._onBevyChange);
    PostStore.on(POST.CHANGE_ALL, this._onPostChange);
    ChatStore.on(CHAT.CHANGE_ALL, this._onChatChange);
  },

  componentWillUnmount: function() {
    BevyStore.off(BEVY.CHANGE_ALL, this._onBevyChange);
    PostStore.off(POST.CHANGE_ALL, this._onPostChange);
    ChatStore.off(CHAT.CHANGE_ALL, this._onChatChange);
  },

  _onBevyChange: function() {
    this.setState({
      allBevies: BevyStore.getAll(),
      activeBevy: BevyStore.getActive()
    });
  },

  _onPostChange: function() {
    this.setState({
      allPosts: PostStore.getAll()
    });
  },
  _onChatChange: function() {
    this.setState({
      allThreads: ChatStore.getAll()
    });
  },

  render: function() {

    return (
        <Navigator
          initialRoute={{name: 'LoadingView', index: 0}}
          renderScene={(route, navigator) => 
            <MainView 
              route={route}
              navigator={navigator}
              { ...this.state }
            />
          }
        />
    );
  }
});

AppRegistry.registerComponent('bevyios', () => bevyios);

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

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 0,
  },
});

var Backbone = require('backbone');
Backbone.sync = function(method, model, options) {

  switch(method) {
    case 'create':
      method = 'POST';
      break;
    case 'read':
    default:
      method = 'GET';
      break;
    case 'update':
      method = 'PATCH';
      break;
    case 'delete':
      method = 'DELETE';
      break;
  }

  console.log(model.url);

  return fetch(model.url, {
    method: method,
    headers: {
      'Accept': 'application/json'
    },
  })
  .then(res => {
    var response = JSON.parse(res._bodyText);

    console.log('model', model);
    console.log('response', response);
    console.log('options', options);

    options.success && options.success(model, response, options);
  });
}

var BevyStore = require('./js/BevyView/BevyStore');

var bevyios = React.createClass({

  getInitialState: function() {



    return {};
  },

  render: function() {
    return (
        <Navigator
          initialRoute={{name: 'LoginNavigator', index: 0}}
          renderScene={(route, navigator) => 
            <MainView 
              route={route}
              navigator={navigator}
            />
          }
        />
    );
  }
});

AppRegistry.registerComponent('bevyios', () => bevyios);

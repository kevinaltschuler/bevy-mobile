/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Text,
  View,
} = React;

var BevyNavigator = require('./js/BevyNavigator.ios.js');
var TabBar = require('./js/TabBar.ios.js');

var bevyios = React.createClass({

  render: function() {
    return (
          <BevyNavigator />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

AppRegistry.registerComponent('bevyios', () => bevyios);

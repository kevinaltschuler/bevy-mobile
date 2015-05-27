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

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 0,
  },
});

var bevyios = React.createClass({

  render: function() {
    return (
        <View style = {styles.container}>
          <BevyNavigator />
        </View>
    );
  }
});

AppRegistry.registerComponent('bevyios', () => bevyios);

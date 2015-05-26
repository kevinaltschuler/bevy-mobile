/**
 * BevyBar.js
 * kevin made this
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Text,
  View,
  NavigatorIOS,
} = React;

var InBevy = require('./InBevy.ios.js');
var SideMenu = require('react-native-side-menu');
var Router = require('react-native-router');
var Button = require('react-native-button');

var Menu = require('./Menu.ios.js');

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
  }
})

var firstRoute = {
  name: 'Frontpage',
  component: InBevy
}

var ContentView = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+Control+Z for dev menu
        </Text>
      </View>
    );
  }
});

var BevyNavigator = React.createClass({

  render: function () {
      var menu = <Menu navigator={Router}/>;

      return (
          <Router
            style={styles.container}
            firstRoute = {firstRoute}
            />
      );
    }
});

module.exports = BevyNavigator;

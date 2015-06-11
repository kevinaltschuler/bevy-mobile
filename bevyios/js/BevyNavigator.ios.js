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
  TouchableHighlight,
  Image,
} = React;

var InBevy = require('./InBevy.ios.js');
var SideMenu = require('react-native-side-menu');
var Router = require('react-native-router');
var Button = require('react-native-button');
var Login = require('./login/components/LoginView.ios.js');

var Menu = require('./Menu.ios.js');

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
    padding: 0,
  },
  backButton: {
    width: 10,
    height: 17,
    marginLeft: 10,
    marginTop: 3,
    marginRight: 10
  }
})

var firstRoute = {
  name: '',
  component: Login
}

var LeftButton = React.createClass({
  render: function () {
    return (
      <Image source={require('image!back_button')} style={styles.backButton} />
      );
  }
});

var BevyNavigator = React.createClass({
  render: function () {
      return (
        <View style={styles.container}>
          <Router
            backButtonComponent={LeftButton}
            headerStyle={styles.container}
            firstRoute = {firstRoute}
          />
        </View>
      );
    }
});

module.exports = BevyNavigator;

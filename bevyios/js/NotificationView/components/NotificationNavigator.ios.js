/**
 * NotificationView.js
 * kevin made this
 * GET NOTIFIED BITCH
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

var Router = require('react-native-router');
var NotificationView = require('./NotificationView.ios.js');

var LeftButton = React.createClass({
  render: function () {
    return (
      <Image source={require('image!back_button')} style={styles.backButton} />
      );
  }
});

var NotificationNavigator = React.createClass({

  render: function () {
      
    var firstRoute = {
      name: 'Notifications',
      component: NotificationView
    }

    return (
        <Router
          backButtonComponent={LeftButton}
          headerStyle={styles.container}
          firstRoute = {firstRoute}
          navigator={this.props.navigator}
        />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#2CB673',
  },
  backButton: {
    width: 10,
    height: 17,
    marginLeft: 10,
    marginTop: 3,
    marginRight: 10
  }
});

module.exports = NotificationNavigator;

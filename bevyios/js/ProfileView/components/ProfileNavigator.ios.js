/**
 * ProfileNavagator.js
 * kevin made this
 * all the sheiks in the world should be banished
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
var ProfileView = require('./ProfileView.ios.js');

var LeftButton = React.createClass({
  render: function () {
    return (
      <Image source={require('image!back_button')} style={styles.backButton} />
      );
  }
});

var ProfileNavagator = React.createClass({

  render: function () {
      
    var firstRoute = {
      name: 'My Profile',
      component: ProfileView,
      data: this.props.navigator
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

module.exports = ProfileNavagator;

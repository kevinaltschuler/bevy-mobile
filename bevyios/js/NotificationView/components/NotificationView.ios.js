/**
 * NotificationView.js
 * kevin made this 
 * albert sucks eggs 
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

var NotificationView = React.createClass({

  render: function () {

    return (
        <Text style={styles.container}>
          Notifs WHATS GUCCI
        </Text>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#aaaaaa',
    paddingTop: 10
  }
})

module.exports = NotificationView;

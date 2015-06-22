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
  ScrollView
} = React;

var NotificationItem = require('./NotificationItem.ios.js')

var NotificationView = React.createClass({

  render: function () {

    return (
        <ScrollView style={styles.container}>
          <NotificationItem />
          <NotificationItem />
          <NotificationItem />
          <NotificationItem />
          <NotificationItem />
        </ScrollView>
    );
  }
});

var styles = StyleSheet.create({
  container: {
  }
})

module.exports = NotificationView;

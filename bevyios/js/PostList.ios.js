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

var TabBar = require('./TabBar.ios.js');
var Menu = require('./Menu.ios.js');
var SideMenu = require('react-native-side-menu');

var styles = StyleSheet.create({
  postContainer: {
    backgroundColor: '#aaaaaa',
  }
})

var PostList = React.createClass({
  render: function() {
    return (
      <View style={styles.postContainer}>
        <Text style={styles.welcome}>
          post
        </Text>
        <Text style={styles.instructions}>
          post
        </Text>
        <Text style={styles.instructions}>
          post
        </Text>
      </View>
    );
  }
});

module.exports = PostList;

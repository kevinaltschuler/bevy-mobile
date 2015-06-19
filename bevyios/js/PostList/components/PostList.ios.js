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
  ListView,
} = React;

var SideMenu = require('react-native-side-menu');

var PostList = React.createClass({

  render: function() {
    return (
      <Text style={styles.postContainer} >
        post list
      </Text>
    );
  },
});


var styles = StyleSheet.create({
  postContainer: {
    backgroundColor: '#aaaaaa',
    paddingTop: 10
  }
})

module.exports = PostList;

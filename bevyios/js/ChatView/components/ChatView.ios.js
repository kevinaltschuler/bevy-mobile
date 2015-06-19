/**
 * ChatView.js
 * kevin made this 
 * SMASH 4 SUCKS 
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

var ChatView = React.createClass({

  render: function () {

    return (
      <Text style={styles.container} >
        chat biiitch
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

module.exports = ChatView;

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

var Menu = React.createClass({

  about: function() {
    this.props.menuActions.close();
  },

  render: function() {
  return (
      <View>
        <Text onPress={this.about}>About</Text>
      </View>
    );
  },

});

module.exports = Menu;

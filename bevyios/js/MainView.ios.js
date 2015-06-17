/**
 * MainView
 * made by kev doggity dizzle
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Text,
  View,
  Navigator
} = React;

var LoginNavigator = require('./login/components/LoginNavigator.ios.js');
var PostNavigator = require('./PostView/components/PostNavigator.ios.js');

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 0,
  },
});

var MainView = React.createClass({

  render: function() {
    switch(this.props.route.name) {
      case 'loginNavigator':
        return <LoginNavigator />;
      break;

      case 'postNavigator':
        return <PostNavigator />;
      break;
    }
  }
});

//module.ESPORTS LOL
module.exports = MainView;

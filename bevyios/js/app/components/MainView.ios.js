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

var LoginNavigator = require('./../../login/components/LoginNavigator.ios.js');
var MainTabBar = require('./MainTabBar.ios.js');

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 0,
  },
});

var MainView = React.createClass({

  propTypes: {
    route: React.PropTypes.object,
    navigator: React.PropTypes.object
  },

  getInitialState: function() {
    return {
      route: {}
    };
  },

  render: function() {

    switch(this.props.route.name) {
      case 'LoginNavigator':
        return <LoginNavigator navigator={this.props.navigator} />;
      break;

      case 'MainTabBar':
        return <MainTabBar { ...this.props } />;
      break;
    }
  }
});

//module.ESPORTS LOL
module.exports = MainView;

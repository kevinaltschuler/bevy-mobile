/**
 * MainView
 * made by kev doggity dizzle
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Navigator
} = React;

var LoadingView = require('./LoadingView.ios.js');
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

      case 'LoadingView':
      return <LoadingView { ...this.props } />;
        break;

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

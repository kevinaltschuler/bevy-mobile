/**
 * MainView
 * made by kev doggity dizzle
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View
} = React;

var LoadingView = require('./LoadingView.ios.js');
var LoginNavigator = require('./../../login/components/LoginNavigator.ios.js');
var MainTabBar = require('./MainTabBar.ios.js');
var SearchBar = require('./../../shared/components/SearchBar.ios.js');

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 0,
  },
});

var MainView = React.createClass({

  propTypes: {
    mainRoute: React.PropTypes.object,
    mainNavigator: React.PropTypes.object
  },

  getInitialState: function() {
    return {
      route: {}
    };
  },

  render: function() {

    switch(this.props.mainRoute.name) {

      case 'LoadingView':
      return <LoadingView { ...this.props } />;
        break;

      case 'LoginNavigator':
        return <LoginNavigator { ...this.props } />;
        break;

      case 'MainTabBar':
        return (
          <View>
            <SearchBar { ...this.props } />
          </View>
        );
        break;
    }
  }
});

var styles = StyleSheet.create({

});

//module.ESPORTS LOL
module.exports = MainView;

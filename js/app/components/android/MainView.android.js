/**
 * MainView.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet
} = React;
var SearchBar = require('./SearchBar.android.js');

var routes = require('./../../../routes');

var MainView = React.createClass({
  propTypes: {
    mainRoute: React.PropTypes.object,
    mainNavigator: React.PropTypes.object
  },

  getInitialState() {
    return {

    };
  },

  render() {
    switch(this.props.mainRoute.name) {
      case routes.MAIN.TABBAR.name:
        return (
          <SearchBar { ...this.props } />
        );
        break;
      default:
        return (
          <View style={ styles.container }>
          </View>
        );
        break;
    }

    

  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0'
  }
});

module.exports = MainView;
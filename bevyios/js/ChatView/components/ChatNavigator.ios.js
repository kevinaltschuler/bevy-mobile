/**
 * PostView.js
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
  ScrollView,
  Image
} = React;

var SideMenu = require('react-native-side-menu');
var BevyList= require('./../../BevyList/components/BevyList.ios.js');
var Router = require('react-native-router');
var ChatView = require('./ChatView.ios.js');

var LeftButton = React.createClass({
  render: function () {
    return (
      <Image source={require('image!back_button')} style={styles.backButton} />
      );
  }
});

var ChatNavigator = React.createClass({

  render: function () {
      
    var firstRoute = {
      name: 'Chat',
      component: ChatView
    }

    var bevyList = <BevyList />

    return (
        <Router
          backButtonComponent={LeftButton}
          headerStyle={styles.headerStyle}
          firstRoute = {firstRoute}
          navigator={this.props.navigator}
        />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    width: 500
  },
  headerStyle: {
    backgroundColor: '#2CB673',
    flex: 1
  },
  backButton: {
    width: 10,
    height: 17,
    marginLeft: 10,
    marginTop: 3,
    marginRight: 10
  }
});

module.exports = ChatNavigator;

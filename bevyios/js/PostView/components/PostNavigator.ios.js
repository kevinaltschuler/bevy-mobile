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
} = React;

var TabBar = require('./../../TabBar.ios.js');
var SideMenu = require('react-native-side-menu');
var PostList = require('./PostList.ios.js');
var Button = require('react-native-button');
var BevyList= require('./../../BevyList/components/BevyList.ios.js');
var BevyListButton = require('./../../BevyList/components/BevyListButton.ios.js');
var Router = require('react-native-router');

var LeftButton = React.createClass({
  render: function () {
    return (
      <Image source={require('image!back_button')} style={styles.backButton} />
      );
  }
});

var PostNavigator = React.createClass({

  render: function () {
      
    var firstRoute = {
      name: 'FrontPage',
      component: PostList,
      leftCorner: BevyListButton,
    }

    var bevyList = <BevyList />

    return (
      <SideMenu menu={bevyList}>
        <Router
          backButtonComponent={LeftButton}
          headerStyle={styles.container}
          firstRoute = {firstRoute}
          navigator={this.props.navigator}
        />
      </SideMenu>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#2CB673',
  },
  backButton: {
    width: 10,
    height: 17,
    marginLeft: 10,
    marginTop: 3,
    marginRight: 10
  }
});

module.exports = PostNavigator;

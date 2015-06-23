/**
 * BevyRouter.js
 * kevin made this
 * sometimes i wish water tasted like salmon
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
  Image
} = React;

var SideMenu = require('react-native-side-menu');
var BevyListButton = require('./../../BevyList/components/BevyListButton.ios.js');
var Router = require('react-native-router');
var PostList = require('./../../PostList/components/PostList.ios.js');
var SortSearchAndInfo = require('./SortSearchAndInfo.ios.js');

var LeftButton = React.createClass({
  render: function () {
    return (
      <Image source={require('image!back_button')} style={styles.backButton} />
      );
  }
});

var BevyRouter = React.createClass({

  render: function () {

    var firstRoute = {
      name: 'FrontPage',
      component: PostList,
      leftCorner: BevyListButton
    }

    return (
        <Router
          backButtonComponent={LeftButton}
          headerStyle={styles.container}
          firstRoute = {firstRoute}
          navigator={this.props.navigator}
          customAction={this.props.menuActions.toggle}
          rightCorner={SortSearchAndInfo}
        />
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

module.exports = BevyRouter;

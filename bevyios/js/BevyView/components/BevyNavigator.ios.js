/**
 * BevyNavigator.js
 * kevin made this
 * yo that party was tight
 */

'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Text,
  View,
  Navigator,
} = React;

var SideMenu = require('react-native-side-menu');
var BevyList= require('./../../BevyList/components/BevyList.ios.js');
var BevyRouter = require('./BevyRouter.ios.js');
var PostList = require('./../../PostList/components/PostList.ios.js');
var BevyListButton = require('./../../BevyList/components/BevyListButton.ios.js');
var SideMenuWrapper = require('./SideMenuWrapper.ios.js');

var BevyNavigator = React.createClass({

  propTypes: {
    allBevies: React.PropTypes.array,
    activeBevy: React.PropTypes.object,
    posts: React.PropTypes.array
  },

  render: function () {

    console.log('nav props', this.props.posts);

    return (
          <Navigator
            style={styles.container}
            initialRoute={{
                name: 'FrontPage', 
                index: 0, 
                component: PostList,
                leftCorner: BevyListButton,
                data: {
                  posts: this.props.posts
                }
              }}
            renderScene={(route, navigator) =>
              <SideMenuWrapper
                firstRoute={route}
                navigator={navigator}
                allBevies={ this.props.allBevies }
                activeBevy={ this.props.activeBevy }
                posts={ this.props.posts }
              />
            }
          />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: 'black',
    width: 600,
    height: 1000
  },
  backButton: {
    width: 10,
    height: 17,
    marginLeft: 10,
    marginTop: 3,
    marginRight: 10
  }
});

module.exports = BevyNavigator;
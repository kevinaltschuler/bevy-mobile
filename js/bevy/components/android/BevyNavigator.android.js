/**
 * BevyNavigator.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Navigator,
  StyleSheet
} = React;
var PostList = require('./../../../post/components/android/PostList.android.js');

var routes = require('./../../../routes');
var constants = require('./../../../constants');

var BevyNavigator = React.createClass({
  propTypes: {

  },

  render() {
    return (
      <Navigator
        initialRouteStack={[
          routes.BEVY.POSTLIST
        ]}
        sceneStyle={{
          flex: 1
        }}
        renderScene={(route, navigator) => {
          switch(route.name) {
            case routes.BEVY.POSTLIST.name:
              return (
                <PostList
                  bevyNavigator={ navigator }
                  bevyRoute={ route }
                  allPosts={ this.props.allPosts }
                />
              );
              break;
            default:
              return (
                <Text>Default Bevy Navigator Route</Text>
              );
              break;
          }
        }}
      />
    );
  }
});

module.exports = BevyNavigator;
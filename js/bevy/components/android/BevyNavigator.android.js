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
var PostView = require('./../../../post/components/android/PostView.android.js');

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
                <PostView
                  bevyNavigator={ navigator }
                  bevyRoute={ route }
                  { ...this.props }
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
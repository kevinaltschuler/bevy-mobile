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
var PostView = require('./../../../post/components/android/PostView.android.js');
var BevyInfoView = require('./BevyInfoView.android.js');
var RelatedView = require('./RelatedView.android.js');

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
                  showNewPostCard={ true }
                  { ...this.props }
                />
              );
              break;
            case routes.BEVY.INFO.name:
              return (
                <BevyInfoView
                  bevyNavigator={ navigator }
                  bevyRoute={ route }
                  { ...this.props }
                />
              );
              break;
            case routes.BEVY.RELATED.name:
              return (
                <RelatedView
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
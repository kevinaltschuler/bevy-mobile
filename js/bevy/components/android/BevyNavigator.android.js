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
          <BevyView
            bevyRoute={ route }
            bevyNavigator={ navigator }
            { ...this.props }
          />
        }}
      />
    );
  }
});

var BevyView = React.createClass({
  propTypes: {
    bevyRoute: React.PropTypes.object,
    bevyNavigator: React.PropTypes.object
  },

  render() {

  }
});

var styles = StyleSheet.create({
  container: {

  }
});

module.exports = BevyNavigator;
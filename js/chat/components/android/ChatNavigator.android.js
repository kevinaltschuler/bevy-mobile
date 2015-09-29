/**
 * ChatNavigator.android.js
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
var ThreadView = require('./ThreadView.android.js');
var MessageView = require('./MessageView.android.js');

var routes = require('./../../../routes');

var ChatNavigator = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object
  },

  render() {
    return (
      <Navigator
        navigator={ this.props.mainNavigator }
        initialRouteStack={[
          routes.CHAT.LISTVIEW
        ]}
        sceneStyle={{
          flex: 1
        }}
        renderScene={(route, navigator) => {
          switch(route.name) {
            case routes.CHAT.LISTVIEW.name:
              return (
                <ThreadView
                  chatRoute={ route }
                  chatNavigator={ navigator }
                  { ...this.props }
                />
              );
              break;
            default:
              return (
                <View>
                  <Text>Default Chat Route</Text>
                </View>
              );
              break;
          }
        }}
      />
    );
  }
});

module.exports = ChatNavigator;
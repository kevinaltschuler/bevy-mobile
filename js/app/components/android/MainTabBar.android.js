/**
 * MainTabBar.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback
} = React;

var constants = require('./../../../constants');

var MainTabBar = React.createClass({
  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.tabBar }>
          <TouchableNativeFeedback onPress={() => console.log('nuts') }background={ TouchableNativeFeedback.Ripple('#000', false) }>
            <View style={ styles.tabBarItem }>
              <Text>Posts</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback background={ TouchableNativeFeedback.Ripple('#000', false) }>
            <View style={ styles.tabBarItem }>
              <Text>Chat</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback background={ TouchableNativeFeedback.Ripple('#000', false) }>
            <View style={ styles.tabBarItem }>
              <Text>Notifications</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback background={ TouchableNativeFeedback.Ripple('#000', false) }>
            <View style={ styles.tabBarItem }>
              <Text>More</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48
  },
  tabBar: {
    height: 48,
    width: constants.width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fff'
  },
  tabBarItem: {
    height: 48,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

module.exports = MainTabBar;
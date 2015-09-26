/**
 * Drawer.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TouchableNativeFeedback,
  StyleSheet
} = React;
var BevyList = require('./../../../bevy/components/android/BevyList.android.js');

var Drawer = React.createClass({

  _renderProfile() {
    return (
      <TouchableNativeFeedback
        background={ TouchableNativeFeedback.Ripple('#aaa', false) }
        onPress={() => {}}
      >
        <View style={ styles.logInButton }>
          <Text style={ styles.logInButtonText }>Log In</Text>
        </View>
      </TouchableNativeFeedback>
    );
  },

  render() {
    return (
      <View style={ styles.container }>
        { this._renderProfile() }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222'
  },
  logInButton: {

  },
  logInButtonText: {

  }
});

module.exports = Drawer;
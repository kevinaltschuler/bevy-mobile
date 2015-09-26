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
        <BevyList { ...this.props } />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#222'
  },
  logInButton: {
    flexDirection: 'row',
    padding: 10
  },
  logInButtonText: {
    flex: 1,
    color: '#fff'
  }
});

module.exports = Drawer;
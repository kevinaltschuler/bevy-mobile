/**
 * SettingsView.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet
} = React;

var SettingsView = React.createClass({
  propTypes: {
    loggedIn: React.PropTypes.bool,
    user: React.PropTypes.object
  },

  render() {
    return (
      <View style={ styles.container }>

      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {

  }
});

module.exports = SettingsView;
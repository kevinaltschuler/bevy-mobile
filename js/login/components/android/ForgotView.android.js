/**
 * ForgotView.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet
} = React;

var routes = require('./../../../routes');
var constants = require('./../../../constants');

var ForgotView = React.createClass({
  propTypes: {
    loginRoute: React.PropTypes.object,
    loginNavigator: React.PropTypes.object
  },

  render() {
    return (
      <View style={ styles.container }>
        <Text>Forgot View</Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2CB673'
  }
});

module.exports = ForgotView;
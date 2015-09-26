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

var ForgotView = React.createClass({
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

  }
});

module.exports = ForgotView;
/**
 * RegisterView.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet
} = React;

var RegisterView = React.createClass({
  render() {
    return (
      <View style={ styles.container }>
        <Text>Register View</Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {

  }
});

module.exports = RegisterView;
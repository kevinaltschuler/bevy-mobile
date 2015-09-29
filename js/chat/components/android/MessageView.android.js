/**
 * MessageView.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet
} = React;

var MessageView = React.createClass({
  render() {
    return (
      <View style={ styles.container }>
        <Text>MessageView</Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {

  }
});

module.exports = MessageView;
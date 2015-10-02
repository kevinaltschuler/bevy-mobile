/**
 * MessageItem.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet
} = React;

var MessageItem = React.createClass({
  propTypes: {
    message: React.PropTypes.object
  },

  render() {
    return (
      <View>
        <Text>MessageItem</Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {

  }
});

module.exports = MessageItem;
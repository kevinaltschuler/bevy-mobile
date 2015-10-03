/**
 * NotificationItem.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet
} = React;

var NotificationItem = React.createClass({
  propTypes: {
    notification: React.PropTypes.object
  },

  render() {
    return (
      <View style={ styles.container }>
        <Text>Notification Item</Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {

  }
});

module.exports = NotificationItem;
/**
 * NotificationView.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  Text,
  View,
  StyleSheet,
  ListView
} = React;
var NotificationList = require('./NotificationList.android.js');

var NotificationView = React.createClass({
  propTypes: {
    allNotifications: React.PropTypes.array
  },

  render() {
    return (
      <View style={ styles.container }>
        <NotificationList
          allNotifications={ this.props.allNotifications }
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {

  }
});

module.exports = NotificationView;
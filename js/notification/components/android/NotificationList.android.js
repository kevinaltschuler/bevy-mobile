/**
 * NotificationList.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet,
  ListView
} = React;

var NotificationItem = require('./NotificationItem.android.js');

var NotificationList = React.createClass({
  propTypes: {
    allNotifications: React.PropTypes.array
  },

  getInitialState() {
    var notifications = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    return {
      notifications: notifications.cloneWithRows(this.props.allNotifications)
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      notifications: this.state.notifications.cloneWithRows(nextProps.allNotifications)
    });
  },

  render() {
    return (
      <View style={ styles.container }>
        <ListView
          dataSource={ this.state.notifications }
          renderRow={(notification) => {
            return (
              <NotificationItem
                key={ 'notification:' + notification._id }
                notification={ notification }
              />
            );
          }}
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {

  }
});

module.exports = NotificationList;
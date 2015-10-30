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
    allNotifications: React.PropTypes.array,
    mainNavigator: React.PropTypes.object
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
          style={ styles.notificationList }
          scrollRenderAheadDistance={ 300 }
          removeClippedSubviews={ true }
          initialListSize={ 10 }
          pageSize={ 10 }
          renderRow={(notification) => {
            return (
              <NotificationItem
                key={ 'notification:' + notification._id }
                notification={ notification }
                mainNavigator={ this.props.mainNavigator }
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

  },
  notificationList: {
    paddingTop: 10
  }
});

module.exports = NotificationList;
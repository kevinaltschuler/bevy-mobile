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

var _ = require('underscore');
var constants = require('./../../../constants');

var NotificationList = React.createClass({
  propTypes: {
    allNotifications: React.PropTypes.array,
    mainNavigator: React.PropTypes.object,
    loggedIn: React.PropTypes.bool
  },

  getInitialState() {
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    return {
      notifications: this.props.allNotifications,
      ds: ds.cloneWithRows(this.props.allNotifications)
    };
  },

  componentWillReceiveProps(nextProps) {
    var notifications = nextProps.allNotifications;
    this.setState({
      notifications: notifications,
      ds: this.state.ds.cloneWithRows(notifications)
    });
  },

  _renderNoNotifications() {
    if(_.isEmpty(this.state.notifications)) {
      return (
        <View style={ styles.noNotificationsContainer }>
          <Text style={ styles.noNotificationsText }>
            No Notifications
            {(this.props.loggedIn)
              ? ''
              : '\nLog In To View Notifications'}
          </Text>
        </View>
      );
    } else {
      return <View />;
    }
  },

  render() {
    return (
      <View style={ styles.container }>
        { this._renderNoNotifications() }
        <ListView
          dataSource={ this.state.ds }
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
    flex: 1,
    paddingTop: 1
  },
  notificationList: {
    flex: 1
  },
  noNotificationsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  noNotificationsText: {
    color: '#AAA',
    fontSize: 22,
    textAlign: 'center'
  }
});

module.exports = NotificationList;
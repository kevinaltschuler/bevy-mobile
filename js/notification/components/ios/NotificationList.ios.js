/**
 * NotificationList.js
 * @author albert
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  ListView,
  RefreshControl,
  ScrollView
} = React;
var NotificationItem = require('./NotificationItem.ios.js');

var _ = require('underscore');
var constants = require('./../../../constants.js');
var NotificationActions = require('./../../../notification/NotificationActions');
var NotificationStore = require('./../../../notification/NotificationStore');
var NOTIFICATION = constants.NOTIFICATION;

var NotificationList = React.createClass({
  propTypes: {
    allNotifications: React.PropTypes.array
  },

  getInitialState() {
    return {
      notes: this.props.allNotifications,
      loading: true
    };
  },

  componentDidMount() {
    NotificationStore.on(NOTIFICATION.FETCHING, this.onLoading);
    NotificationStore.on(NOTIFICATION.FETCHED, this.onLoaded);
  },
  componentWillUnmount() {
    NotificationStore.off(NOTIFICATION.FETCHING, this.onLoading);
    NotificationStore.off(NOTIFICATION.FETCHED, this.onLoaded);
  },

  onLoading() {
    this.setState({
      loading: true
    });
  },
  onLoaded() {
    this.setState({
      loading: false,
      notes: NotificationStore.getAll()
    });
  },
  onRefresh() {
    NotificationActions.fetch();
  },

  _renderNoNotificationsText() {
    if(_.isEmpty(this.props.allNotifications)) {
      return (
        <View style={ styles.noNotificationsContainer }>
          <Text style={ styles.noNotificationsText }>
            No Notifications
          </Text>
        </View>
      );
    } else {
      return <View />;
    }
  },

  _renderNotes() {
    var notes = [];
    for(var key in this.state.notes) {
      var note = this.state.notes[key];
      notes.push(
        <NotificationItem
          key={'note:' + note._id}
          mainNavigator={ this.props.mainNavigator }
          notification={ note }
        />
      );
    }
    return notes;
  },

  render() {
    return (
      <View style={ styles.container }>
        { this._renderNoNotificationsText() }
        <ScrollView
          automaticallyAdjustContentInsets={ false }
          contentContainerStyle={{
            paddingBottom: 48
          }}
          refreshControl={
            <RefreshControl
              refreshing={ this.state.loading }
              onRefresh={ this.onRefresh }
              tintColor='#AAA'
              title='Loading...'
            />
          }
        >
          { this._renderNotes() }
        </ScrollView>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee'
  },
  noNotificationsContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  noNotificationsText: {
    fontSize: 22,
    color: '#aaa'
  }
});

module.exports = NotificationList;

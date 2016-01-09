/**
 * NotificationView.js
 * @author albert
 * @flow
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Navigator
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var NotificationList = require('./NotificationList.ios.js');
var StatusBarSizeIOS = require('react-native-status-bar-size');

var _ = require('underscore');
var routes = require('./../../../routes');
var NotificationActions = require('./../../../notification/NotificationActions');

var NotificationView = React.createClass({
  propTypes: {
    allNotifications: React.PropTypes.array
  },

  render: function() {
    return (
      <View style={{ flex: 1 }}>
      <View style={ styles.topBarContainer }>
        <View style={{
          height: StatusBarSizeIOS.currentHeight,
          backgroundColor: '#2CB673'
        }}/>
        <View style={ styles.topBar }>
          <Text style={ styles.title }>
            Notifications
          </Text>
        </View>
      </View>
        <NotificationList
          { ...this.props }
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#2CB673',
  },
  topBarContainer: {
    flexDirection: 'column',
    paddingTop: 0,
    overflow: 'visible',
    backgroundColor: '#2CB673'
  },
  topBar: {
    height: 48,
    backgroundColor: '#2CB673',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 17,
    textAlign: 'center',
    color: '#FFF'
  },
  dismissAllButton: {
    width: 30,
    height: 30
  },
});

module.exports = NotificationView;

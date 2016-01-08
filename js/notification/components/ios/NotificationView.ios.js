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
var Icon = require('react-native-vector-icons/Ionicons');
var NotificationList = require('./NotificationList.ios.js');
var BackButton = require('./../../../shared/components/ios/BackButton.ios.js');
var Navbar = require('./../../../shared/components/ios/Navbar.ios.js');

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
        <Navbar
          center={
            <Text style={{
              color: '#999',
              fontSize: 18,
              marginLeft: 10,
              fontWeight: 'bold'
            }}>
              Notifications
            </Text>
          }
          { ...this.props }
        />
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
  navbar: {
    backgroundColor: '#2CB673',
    flexDirection: 'row',
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    height: 64,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  navbarText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '500'
  },
  left: {
    flex: 1,
    height: 32,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start'
  },
  center: {
    flex: 2,
    height: 32,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  right: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    height: 32
  },
  dismissAllButton: {
    width: 30,
    height: 30
  },
});

module.exports = NotificationView;

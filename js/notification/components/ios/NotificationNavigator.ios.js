/**
 * NotificationView.js
 * kevin made this
 * GET NOTIFIED BITCH
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
    notificationRoute: React.PropTypes.object,
    notificationNavigator: React.PropTypes.object,
    allNotifications: React.PropTypes.array
  },

  render: function() {
    var view;
    switch(this.props.notificationRoute.name) {
      case 'NotificationList':
      default:
        view = (
          <NotificationList
            { ...this.props }
          />
        );
        break;
    }

    var clearAllButton = (true)
    ? <View />
    : (
      <TouchableHighlight
        underlayColor={'rgba(0,0,0,0)'}
        onPress={() => {
          NotificationActions.dismissAll();
        }}
      >
        <Icon
          name='ios-minus'
          size={30}
          color='#666'
          style={styles.dismissAllButton}
        />
      </TouchableHighlight>
    );

    return (
      <View style={{ flex: 1 }}>
        <Navbar
          notificationRoute={ this.props.notificationRoute }
          notificationNavigator={ this.props.notificationNavigator }
          center={<Text style={{color: '#999', fontSize: 18, marginLeft: 10, fontWeight: 'bold'}}>Notifications</Text>}
          right={ clearAllButton }
          { ...this.props }
        />
        { view }
      </View>
    );
  }
});

var NotificationNavigator = React.createClass({
  render: function () {
    return (
      <Navigator
        navigator={ this.props.mainNavigator }
        initialRoute={ routes.NOTIFICATION.LIST }
        initialRouteStack={ _.toArray(routes.NOTIFICATION) }
        renderScene={(route, navigator) =>
          <NotificationView
            notificationRoute={ route }
            notificationNavigator={ navigator }
            { ...this.props }
          />
        }
      />
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

module.exports = NotificationNavigator;

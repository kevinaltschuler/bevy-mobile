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

var NotificationList = require('./NotificationList.ios.js');
var BackButton = require('./../../shared/components/BackButton.ios.js');

var {
  Icon
} = require('react-native-icons');

var NotificationActions = require('./../NotificationActions');

var Navbar = React.createClass({
  propTypes: {
    notificationRoute: React.PropTypes.object,
    notificationNavigator: React.PropTypes.object
  },

  dismissAll: function() {
    NotificationActions.dismissAll();
  },

  render: function() {
    return (
      <View style={ styles.navbar }>
        <View style={ styles.left }>
          {/* backButton */}
        </View>
        <View style={ styles.center }>
          <Text style={ styles.navbarText }>Notifications</Text>
        </View>
        <View style={ styles.right }>
          <TouchableHighlight
            underlayColor={'rgba(0,0,0,0)'}
            onPress={ this.dismissAll }
          >
            <Icon
              name='ion|ios-minus'
              size={30}
              color='white'
              style={styles.dismissAllButton}
            />
          </TouchableHighlight>
        </View>
      </View>
    );
  }
});

var NotificationView = React.createClass({
  propTypes: {
    notificationRoute: React.PropTypes.object,
    notificationNavigator: React.PropTypes.object
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

    return (
      <View style={{ flex: 1 }}>
        <Navbar 
          notificationRoute={ this.props.notificationRoute }
          notificationNavigator={ this.props.notificationNavigator }
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
        initialRoute={{ name: 'NotificationList', index: 0 }}
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

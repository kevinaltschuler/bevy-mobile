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
  Navigator
} = React;

var NotificationList = require('./NotificationList.ios.js');

var LeftButton = React.createClass({
  render: function () {
    return (
      <Image source={require('image!back_button')} style={styles.backButton} />
    );
  }
});

var Navbar = React.createClass({
  propTypes: {
    notificationRoute: React.PropTypes.object,
    notificationNavigator: React.PropTypes.object
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
    height: 32,
    width: 32,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  center: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  right: {
    height: 64,
    width: 32,
  }
});

module.exports = NotificationNavigator;

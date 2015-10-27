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

var _ = require('underscore');

var NotificationView = React.createClass({
  propTypes: {
    allNotifications: React.PropTypes.array,
    mainNavigator: React.PropTypes.object
  },

  _renderNone() {
    return (
      <View style={ styles.noneContainer }>
        <Text style={ styles.noneText }>No Notifications!</Text>
      </View>
    );
  },

  _renderList() {
    if(_.isEmpty(this.props.allNotifications)) return this._renderNone();
    return (
      <NotificationList
        allNotifications={ this.props.allNotifications }
        mainNavigator={ this.props.mainNavigator }
      />
    );
  },

  render() {
    return (
      <View style={ styles.container }>
        { this._renderList() }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE'
  },
  noneContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  noneText: {
    fontSize: 20,
    color: '#AAA',
    fontWeight: 'bold'
  }
});

module.exports = NotificationView;
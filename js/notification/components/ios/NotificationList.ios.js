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
  ScrollView
} = React;
var NotificationItem = require('./NotificationItem.ios.js');

var _ = require('underscore');
var constants = require('./../../../constants.js');

var NotificationList = React.createClass({
  propTypes: {
    allNotifications: React.PropTypes.array
  },

  getInitialState() {
    return {
      notes: this.props.allNotifications
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      notes: nextProps.allNotifications
    });
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

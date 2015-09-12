/**
 * NotificationList.js
 * kevin made this 
 * albert sucks eggs 
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  ListView
} = React;

var NotificationItem = require('./NotificationItem.ios.js');

var _ = require('underscore');
var constants = require('./../../constants.js');

var NotificationList = React.createClass({

  propTypes: {
    allNotifications: React.PropTypes.array
  },

  getInitialState() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    return { 
      dataSource: ds.cloneWithRows(this.props.allNotifications)
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(nextProps.allNotifications)
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

  render() {
    return (
      <View style={ styles.container }>
        { this._renderNoNotificationsText() }
        <ListView
          dataSource={ this.state.dataSource }
          renderRow={(notification) => 
            <NotificationItem 
              notification={ notification }
            />
          }
        />
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

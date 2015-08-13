/**
 * NotificationList.js
 * kevin made this 
 * albert sucks eggs 
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Text,
  View,
  ListView
} = React;

var NotificationItem = require('./NotificationItem.ios.js');
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

  render() {

    return (
      <View style={ styles.container }>
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
    backgroundColor: '#ddd'
  }
})

module.exports = NotificationList;

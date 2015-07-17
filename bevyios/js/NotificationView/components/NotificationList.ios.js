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

  getInitialState: function() {
    return { };
  },

  componentWillReceiveProps: function(nextProps) {

  },

  render: function () {

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var dataSource = ds.cloneWithRows(this.props.allNotifications);

    return (
      <View style={ styles.container }>
        <ListView
          dataSource={dataSource}
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

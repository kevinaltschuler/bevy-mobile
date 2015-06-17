/**
 * BevyBar.js
 * kevin made this
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Text,
  View,
  NavigatorIOS,
  ListView,
} = React;

var BevyList = React.createClass({
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows(['balls', 'row 2']),
    };
  },
  
  render: function() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) => <Text>{rowData}</Text>}
      />
    );
  }

});

module.exports = BevyList;

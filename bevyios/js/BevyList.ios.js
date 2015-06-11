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

getInitialState: function() {
  var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  return {
    dataSource: ds.cloneWithRows(['balls', 'row 2']),
  };
},

var BevyList = React.createClass({
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

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

var RListView = require('react-native-refreshable-listview');

var TabBar = require('./TabBar.ios.js');
var Menu = require('./Menu.ios.js');
var SideMenu = require('react-native-side-menu');

var styles = StyleSheet.create({
  postContainer: {
    backgroundColor: '#aaaaaa',
  }
})

var PostList = React.createClass({

  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows(['balls', 'row 2']),
    };
  },

  render: function() {
    return (
      <RListView 
        style={styles.postContainer}
        dataSource={this.state.dataSource}
        renderRow={(rowData) => <Text>{rowData}</Text>}/>
    );
  }
});

module.exports = PostList;

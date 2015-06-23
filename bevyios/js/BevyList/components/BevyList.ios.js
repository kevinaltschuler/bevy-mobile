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
  TouchableHighlight
} = React;

var api = require('./../../utils/api.js');
var constants = require('./../../utils/constants.js');
var _ = require('underscore');

var BevyList = React.createClass({
  buildBevyList: function() {
    var user = constants.getUser();

    return api.getBevies(user)
    .then((res) => res);
  },

  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var bevyArray = [];
    bevyArray = [{name: 'bevy 1'}, {name: 'bevy2'}];
    return {
      dataSource: ds.cloneWithRows(bevyArray),
    };
  },
  
  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <Text style={styles.whiteText}>
            Your Bevies
          </Text>
        </View>
        <ListView
          dataSource={this.state.dataSource}
          style={styles.listContainer}
          renderRow={(rowData) => (
            <TouchableHighlight style={styles.rowContainer} >
              <Text style={styles.whiteText}>
                {rowData.name}
              </Text>
            </TouchableHighlight>)}
        />
      </View>
    );
  }

});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    width: 250,
    paddingTop: 35,
    backgroundColor: 'rgba(29,30,26,1)',
  },
  title: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  listContainer: {
    flex: 1,
    paddingTop: 10,
    height: 800
  },
  rowContainer: {
    padding: 10,
  },
  whiteText: {
    color: 'white'
  }
});

module.exports = BevyList;

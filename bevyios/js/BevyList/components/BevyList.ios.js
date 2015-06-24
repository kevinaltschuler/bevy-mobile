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
var constants = require('./../../constants.js');
var _ = require('underscore');

var BevyList = React.createClass({
  buildBevyList: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var user = constants.getUser();

    api.getBevies(user)
    .then((res) => {
      this.setState({
        dataSource: ds.cloneWithRows(res)
      });
    });
  },

  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    var bevyArray = [];

    return {
      dataSource: ds.cloneWithRows(bevyArray),
    };
  },

  changeBevy: function() {

  },
  
  render: function() {
    this.buildBevyList();

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
            <TouchableHighlight 
              style={styles.rowContainer}
              onPress={this.changeBevy(rowData)} 
            >
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

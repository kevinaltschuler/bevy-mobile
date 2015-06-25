/**
 * BevyList.js
 * kevin made this
 * the yung sauce villain
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
var BEVY = constants.BEVY;
var _ = require('underscore');

var BevyList = React.createClass({

  propTypes: {
    allBevies: React.PropTypes.array,
    activeBevy: React.PropTypes.object
  },

  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    return {
      dataSource: ds.cloneWithRows([])
    };
  },

  componentWillReceiveProps: function(nextProps) {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.setState({
      dataSource: ds.cloneWithRows(nextProps.allBevies)
    });
  },

  changeBevy: function() {

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

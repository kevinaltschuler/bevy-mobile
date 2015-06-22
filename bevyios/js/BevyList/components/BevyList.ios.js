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
            <View style={styles.rowContainer} >
              <Text style={styles.whiteText}>
                {rowData}
              </Text>
            </View>)}
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
    paddingTop: 50,
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

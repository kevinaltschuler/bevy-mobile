/**
 * BevyList.js
 * kevin made this
 * the yung sauce villain
 */
'use strict';

var React = require('react-native');
var _ = require('underscore');
var {
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight
} = React;

var api = require('./../../utils/api.js');
var PostList = require('./../../PostList/components/PostList.ios.js');
var constants = require('./../../constants.js');
var BevyActions = require('./../BevyActions');
var BEVY = constants.BEVY;


var BevyList = React.createClass({
  propTypes: {
    allBevies: React.PropTypes.array,
    activeBevy: React.PropTypes.object,
    menuActions: React.PropTypes.object
  },

  changeBevy: function(rowData) {

  },
  
  render: function() {

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var dataSource = ds.cloneWithRows(this.props.allBevies);

    var crud = 'crud';

    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <Text style={styles.whiteText}>
            Your Bevies
          </Text>
        </View>
        <ListView
          dataSource={dataSource}
          style={styles.listContainer}
          renderRow={(rowData) => (
            <TouchableHighlight 
              style={styles.rowContainer}
              onPress={(crud) => {

              BevyActions.switchBevy(rowData._id);

              this.props.menuActions.close();
            }}
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
    flexDirection: 'column',
    alignItems: 'center'
  },
  listContainer: {
    flex: 1
  },
  rowContainer: {
    padding: 10,
  },
  whiteText: {
    color: 'white'
  }
});

module.exports = BevyList;
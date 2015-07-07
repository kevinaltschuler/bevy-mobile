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
var PostList = require('./../../PostList/components/PostList.ios.js');
var BevyListButton = require('./../../BevyList/components/BevyListButton.ios.js');
var constants = require('./../../constants.js');
var BevyActions = require('./../../BevyView/BevyActions');
var BEVY = constants.BEVY;
var _ = require('underscore');

var BevyList = React.createClass({

  propTypes: {
    allBevies: React.PropTypes.array,
    activeBevy: React.PropTypes.object
  },

  changeBevy: function(rowData) {
    constants.getBevyNavigator().push({
      name: rowData.name, 
      index: 1, 
      component: PostList,
      leftCorner: BevyListButton,
      data: {activeBevy: this.props.activeBevy}
    });
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

              constants.getBevyNavigator().push({
                name: rowData.name, 
                index: 1, 
                component: PostList,
                leftCorner: BevyListButton,
                data: {
                  posts: this.props.posts
                }
              });
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

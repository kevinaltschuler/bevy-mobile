/**
 * BevyList.js
 * kevin made this
 * the yung sauce villain
 */
'use strict';

var React = require('react-native');
var window = require('Dimensions').get('window');
var _ = require('underscore');
var {
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight
} = React;

var PostList = require('./../../post/components/PostList.ios.js');

var constants = require('./../../constants.js');
var BevyActions = require('./../BevyActions');
var BEVY = constants.BEVY;

var BevyList = React.createClass({
  propTypes: {
    allBevies: React.PropTypes.array,
    activeBevy: React.PropTypes.object,
    menuActions: React.PropTypes.object
  },

  getInitialState() {
    return {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.props.allBevies)
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(nextProps.allBevies)
    });
  },

  changeBevy: function(rowData) {

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
          dataSource={ this.state.dataSource }
          style={styles.listContainer}
          renderRow={(bevy) => (
            <TouchableHighlight 
              style={styles.rowContainer}
              onPress={() => {
                BevyActions.switchBevy(bevy._id);
                this.props.menuActions.close();
              }}
            >
              <Text style={styles.whiteText}>
                {bevy.name}
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
    paddingTop: 35,
    width: constants.sideMenuWidth,
    height: window.height,
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

/**
 * BevyNavigator.js
 * kevin made this
 * yo that party was tight
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
} = React;

var SideMenu = require('react-native-side-menu');
var BevyList= require('./../../BevyList/components/BevyList.ios.js');
var BevyRouter = require('./BevyRouter.ios.js');

var BevyNavigator = React.createClass({

  propTypes: {
    allBevies: React.PropTypes.array
  },

  render: function () {

    var bevyList = (
      <BevyList 
        allBevies={ this.props.allBevies }
      />
    );

    return (
      <SideMenu 
        menu={bevyList}
        disableGestures={true}
      >
        <BevyRouter />
      </SideMenu>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#2CB673',
  },
  backButton: {
    width: 10,
    height: 17,
    marginLeft: 10,
    marginTop: 3,
    marginRight: 10
  }
});

module.exports = BevyNavigator;

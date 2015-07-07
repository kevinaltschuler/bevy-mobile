/**
 * SideMenuWrapper.ios.js
 * kevin made this
 * kirs has weird biceps
 */

'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Text,
  View,
  Navigator,
} = React;

var SideMenu = require('react-native-side-menu');
var BevyList= require('./../../BevyList/components/BevyList.ios.js');
var BevyRouter = require('./BevyRouter.ios.js');
var PostList = require('./../../PostList/components/PostList.ios.js');
var BevyListButton = require('./../../BevyList/components/BevyListButton.ios.js');
var constants = require('./../../constants');

var BevyNavigator = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object,
    firstRoute: React.PropTypes.object,
    allBevies: React.PropTypes.array,
    activeBevy: React.PropTypes.object
  },

  render: function () {

    var bevyList = (
      <BevyList 
        allBevies={ this.props.allBevies }
        activeBevy={ this.props.activeBevy }
        posts= { this.props.posts }
      />
    );
    
    constants.setBevyNavigator(this.props.navigator);

    return (

          <View style={styles.container} >
            <SideMenu 
              menu={bevyList}
              disableGestures={true}
            >
              <BevyRouter 
                firstRoute={this.props.firstRoute}
                navigator={this.props.navigator}
                allBevies={ this.props.allBevies }
                activeBevy={ this.props.activeBevy }
              />
            </SideMenu>
          </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
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
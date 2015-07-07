/**
 * BevyRouter.js
 * kevin made this
 * sometimes i wish water tasted like salmon
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
  Image,
  Navigator
} = React;

var SideMenu = require('react-native-side-menu');
var BevyListButton = require('./../../BevyList/components/BevyListButton.ios.js');
var Router = require('react-native-router');
var PostList = require('./../../PostList/components/PostList.ios.js');
var BevyList= require('./../../BevyList/components/BevyList.ios.js');
var constants = require('./../../constants.js');
var SortSearchAndInfo = require('./SortSearchAndInfo.ios.js');

var LeftButton = React.createClass({
  render: function () {
    return (
      <Image source={require('image!back_button')} style={styles.backButton} />
      );
  }
});

var BevyRouter = React.createClass({

  propTypes: {
    allBevies: React.PropTypes.array,
    activeBevy: React.PropTypes.object,
    firstRoute: React.PropTypes.object,
  },

  getInitialState: function() {
    return {
      activeName: 'Not in a bevy'
    }
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      activeName: nextProps.activeBevy.name || 'Not in a bevy'
    });
  },

  render: function () {


    var activeBevy = this.props.activeBevy;

    //console.log('route: ', this.props.firstRoute);

    return (
        <View style={styles.container} >
          <Router
            backButtonComponent={LeftButton}
            headerStyle={styles.container}
            firstRoute={this.props.firstRoute}
            customAction={this.props.menuActions.toggle}
            rightCorner={SortSearchAndInfo}
          />
        </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#2CB673',
    flex: 1,
    padding: 0
  },
  backButton: {
    width: 10,
    height: 17,
    marginLeft: 10,
    marginTop: 3,
    marginRight: 10
  }
});

module.exports = BevyRouter;

/**
 * BevyNavigator.ios.js
 * @author albert
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableHighlight,
  TouchableOpacity
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var SideMenu = require('react-native-side-menu');
var LeftSideMenu = require('./LeftSideMenu.ios.js');
var RightSideMenu = require('./RightSideMenu.ios.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var PostActions = require('./../../../post/PostActions');
var PostStore = require('./../../../post/PostStore');
var BevyStore = require('./../../../bevy/BevyStore');
var BOARD = constants.BOARD;

var BevyView = React.createClass({
  propTypes: {
    bevyRoute: React.PropTypes.object,
    bevyNavigator: React.PropTypes.object,
    activeBevy: React.PropTypes.object,
    allPosts: React.PropTypes.array,
    user: React.PropTypes.object
  },

  getInitialState() {
    return {
      showTags: false,
      showSort: false,
      scrollY: null,
      navHeight: 0,
      leftOpen: false,
      rightOpen: false
    }
  },

  componentDidMount() {
    BevyStore.on(BOARD.CREATED, this.onBoardCreated);
  },
  componentWillUnmount() {
    BevyStore.off(BOARD.CREATED, this.onBoardCreated);
  },

  onBoardCreated(board) {
    this.closeSideMenu();
  },

  openLeftMenu() {
    this.setState({ leftOpen: true });
  },
  closeLeftMenu() {
    this.setState({ leftOpen: false });
  },
  toggleLeftMenu() {
    this.setState({ leftOpen: !this.state.leftOpen });
  },
  isLeftMenuOpen() {
    return this.state.leftOpen;
  },

  openRightMenu() {
    this.setState({ rightOpen: true });
  },
  closeRightMenu() {
    this.setState({ rightOpen: false });
  },
  toggleRightMenu() {
    this.setState({ rightOpen: !this.state.rightOpen });
  },
  isRightMenuOpen() {
    return this.state.rightOpen;
  },

  goBackMain() {
    this.props.mainNavigator.pop();
  },
  goBackBevy() {
    this.props.bevyNavigator.pop();
  },

  onScroll(y) {
    // if theres nothing to compare it to yet, just set it and return
    if(this.state.scrollY == null || y < 0) {
      this.setState({
        scrollY: y,
        navHeight: 0
      });
      return;
    }
    //get the change in scroll
    var diff = (this.state.scrollY - y);
    if(diff > 15) diff = 15;
    if(diff < -15) diff = -15;
    //modify the navheight based on that
    var navHeight = (this.state.navHeight - diff);
    //set bounds
    if(navHeight < 0) navHeight = 0;
    if(navHeight > 40) navHeight = 40;
    //console.log(navHeight);
    //update data
    this.setState({
      scrollY: y,
      navHeight: navHeight
    })
  },

  render: function() {
    var rightMenuActions = {
      open: this.openRightMenu,
      close: this.closeRightMenu,
      toggle: this.toggleRightMenu,
      isOpen: this.isRightMenuOpen
    };

    var leftMenuActions = {
      open: this.openLeftMenu,
      close: this.closeLeftMenu,
      toggle: this.toggleLeftMenu,
      isOpen: this.isLeftMenuOpen
    };

    var view;
    switch(this.props.bevyRoute.name) {
      case routes.BEVY.INFO:
        let BevyInfoView = require('./BevyInfoView.ios.js');
        view = (
          <BevyInfoView
            rightMenuActions={ rightMenuActions }
            leftMenuActions={ leftMenuActions }
            { ...this.props }
          />
        );
        break;
      case routes.BEVY.SETTINGS:
        let BevySettingsView = require('./BevySettingsView.ios.js');
        view = (
          <BevySettingsView
            setting={ this.props.bevyRoute.setting }
            rightMenuActions={ rightMenuActions }
            leftMenuActions={ leftMenuActions }
            { ...this.props }
          />
        );
        break;
      case routes.BEVY.BEVYVIEW:
        let $BevyView = require('./BevyView.ios.js');
        view = (
          <$BevyView
            rightMenuActions={ rightMenuActions }
            leftMenuActions={ leftMenuActions }
            { ...this.props }
          />
        );
        break;
      case routes.BEVY.BOARDINFO:
        let BoardInfoView = require('./BoardInfoView.ios.js');
        view = (
          <BoardInfoView
            rightMenuActions={ rightMenuActions }
            leftMenuActions={ leftMenuActions }
            { ...this.props }
          />
        );
        break;
      case routes.BEVY.BOARDSETTINGS:
        let BoardSettingsView = require('./BoardInfoView.ios.js');
        view = (
          <BoardSettingsView
            rightMenuActions={ rightMenuActions }
            leftMenuActions={ leftMenuActions }
            editing={ true }
            { ...this.props }
          />
        );
        break;
      default:
        view = (
          <View>
            <Text>UNKNOWN BEVY ROUTE SUPPLIED</Text>
          </View>
        );
        break;
    }

    return (
      <SideMenu
        menu={
          <LeftSideMenu
            closeSideMenu={ this.closeLeftMenu }
            { ...this.props }
          />
        }
        menuPosition='left'
        openMenuOffset={ constants.width * (4/5) }
        onChange={ isOpen => this.setState({ leftOpen: isOpen })}
        isOpen={ this.state.leftOpen }
      >
        <SideMenu
          menu={
            <RightSideMenu
              closeSideMenu={ this.closeRightMenu }
              { ...this.props }
            />
          }
          menuPosition='right'
          openMenuOffset={ constants.width * (4/5) }
          onChange={ isOpen => this.setState({ rightOpen: isOpen })}
          isOpen={ this.state.rightOpen }
        >
          { view }
        </SideMenu>
      </SideMenu>
    );
  }
});

var BevyNavigator = React.createClass({
  propTypes: {
    searchNavigator: React.PropTypes.object,
    myBevies: React.PropTypes.array,
    activeBevy: React.PropTypes.object,
    allPosts: React.PropTypes.array
  },

  render: function () {
    return (
      <Navigator
        navigator={ this.props.searchNavigator }
        initialRouteStack={[{
          name: routes.BEVY.BEVYVIEW
        }]}
        renderScene={(route, navigator) =>
          <BevyView
            bevyRoute={ route }
            bevyNavigator={ navigator }
            { ...this.props }
          />
        }
      />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    backgroundColor: '#000'
  },
  headerStyle: {
    backgroundColor: '#2CB673',
    flex: 1
  },
  sortMenu: {
    width: 30,
    height: 30
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    height: 40,
    paddingHorizontal: 8
  },
  sideMenuButton: {
    marginRight: 10,
    borderRadius: 2,
    paddingHorizontal: 5,
    paddingVertical: 5,
  }
});

module.exports = BevyNavigator;

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
var BevyNavbar = require('./BevyNavbar.ios.js');
var PostList = require('./../../../post/components/ios/PostList.ios.js');
var InfoView = require('./InfoView.ios.js');
var SettingsView = require('./BevySettingsView.ios.js');
var MyBevies = require('./MyBevies.ios.js');
var Icon = require('react-native-vector-icons/MaterialIcons');
var SideMenu = require('react-native-side-menu');
var BevySideMenu = require('./BevySideMenu.ios.js');
var $BevyView = require('./BevyView.ios.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var PostActions = require('./../../../post/PostActions');
var PostStore = require('./../../../post/PostStore');
var StatusBarSizeIOS = require('react-native-status-bar-size');

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
      sideMenuOpen: false,
    }
  },

  openSideMenu() {
    this.setState({ sideMenuOpen: true });
  },

  closeSideMenu() {
    this.setState({ sideMenuOpen: false });
  },

  toggleSideMenu() {
    this.setState({ sideMenuOpen: !this.state.sideMenuOpen });
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

  _renderSideMenuButton() {
    return (
      <TouchableHighlight
        underlayColor={'rgba(0,0,0,0.1)'}
        style={ styles.sideMenuButton }
        onPress={ this.toggleSideMenu }
      >
          <Icon
            name='menu'
            size={ 30 }
            color='#FFF'
          />
      </TouchableHighlight>
    );
  },

  _renderBackButton(func) {
    return (
      <TouchableOpacity
        activeOpacity={ 0.5 }
        style={ styles.backButton }
        onPress={ func }
      >
        <Icon
          name='arrow-back'
          size={ 30 }
          color='#FFF'
        />
      </TouchableOpacity>
    );
  },

  render: function() {
    var sideMenuActions = {
      open: this.openSideMenu,
      close: this.closeSideMenu,
      toggle: this.toggleSideMenu
    };

    var view;
    switch(this.props.bevyRoute.name) {
      case routes.BEVY.INFO.name:
        view = (
          <InfoView
            { ...this.props }
          />
        );
        break;
      case routes.BEVY.SETTINGS.name:
        view = (
          <SettingsView
            setting={ this.props.bevyRoute.setting }
            { ...this.props }
          />
        );
        break;
      case routes.BEVY.BEVYVIEW.name:
        view = (
          <$BevyView
            { ...this.props }
            sideMenuActions={ sideMenuActions }
          />
        );
        break;
    }

    return (
      <SideMenu
        menu={
          <BevySideMenu
            closeSideMenu={ this.closeSideMenu }
            { ...this.props }
          />
        }
        menuPosition='right'
        openMenuOffset={ constants.width * (4/5) }
        onChange={ isOpen => this.setState({ sideMenuOpen: isOpen })}
        isOpen={ this.state.sideMenuOpen }
      >
        { view }
      </SideMenu>
    );
  }
});

var BevyNavigator = React.createClass({
  propTypes: {
    myBevies: React.PropTypes.array,
    activeBevy: React.PropTypes.object,
    allPosts: React.PropTypes.array
  },

  render: function () {
    return (
      <Navigator
        navigator={ this.props.searchNavigator }
        initialRouteStack={[
          routes.BEVY.BEVYVIEW
        ]}
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

/**
 * tabBar.js
 * kevin made this
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  Image,
  View,
  StatusBarIOS,
  TabBarIOS,
} = React;

var Icon = require('react-native-vector-icons/Ionicons');

var constants = require('./../../constants');
var routes = require('./../../routes');
var BEVY = constants.BEVY;

var BevyNavigator = require('./../../bevy/components/BevyNavigator.ios.js');
var ChatNavigator = require('./../../chat/components/ChatNavigator.ios.js');
var NotificationNavigator = require('./../../notification/components/NotificationNavigator.ios.js');
var SettingsView = require('./../../settings/components/SettingsView.ios.js');

var NotificationStore = require('./../../notification/NotificationStore');
var BevyStore = require('./../../bevy/BevyStore');

var tabs = {
  Posts: 'BevyNavigator',
  Chat: 'ChatNavigator',
  Notifications: 'NotificationNavigator',
  More: 'SettingsNavigator'
};

var MainTabBar = React.createClass({

  getInitialState() {
    return {
      selectedTab: tabs.Posts,
    };
  },

  componentDidMount() {
    BevyStore.on(BEVY.NAV_POSTVIEW, this.navPostView);
  },

  navPostView() {
    this.setState({
      selectedTab: tabs.Posts,
    });
  },

  switchTab(tabName) {
    this.setState({
      selectedTab: tabs[tabName]
    });
  },

  _renderContent() {

    var tabBarActions = {
      switchTab: this.switchTab
    };

    switch(this.state.selectedTab) {
      case tabs.Posts:
        return (
          <BevyNavigator 
            { ...this.props } 
            tabBarActions={ tabBarActions }
          />
        );
        break;
      case tabs.Chat:
        return (
          <ChatNavigator 
            { ...this.props } 
            tabBarActions={ tabBarActions }
          />
        );
        break;
      case tabs.Notifications:
        return (
          <NotificationNavigator 
            { ...this.props } 
            tabBarActions={ tabBarActions }
          />
        );
        break;
      case tabs.More:
        return (
          <SettingsView 
            { ...this.props } 
            tabBarActions={ tabBarActions } 
          />
        );
    }
  },

  render() {
    return (
        <TabBarIOS 
          tintColor='#2cb673' 
          barTintColor='#FFF' 
          translucent={ false }
        >
          <Icon.TabBarItem
            title='Posts'
            iconName='ios-list'
            selectedIconName='ios-list'
            color='rgba(0,0,0,.3)'
            size={ 28 }
            selected={ this.state.selectedTab === tabs.Posts }
            style={ styles.tabIcon }
            onPress={() => {
              this.setState({
                selectedTab: tabs.Posts,
              });
            }}
          >
            { this._renderContent() }
          </Icon.TabBarItem>
          <Icon.TabBarItem
            title='Chat'
            iconName='ios-chatbubble'
            selectedIconName='ios-chatbubble'
            color='rgba(0,0,0,.3)'
            size={ 28 }
            selected={ this.state.selectedTab === tabs.Chat }
            style={ styles.tabIcon }
            onPress={() => {
              this.setState({
                selectedTab: tabs.Chat,
              });
            }}
          >
            { this._renderContent() }
          </Icon.TabBarItem>
          <Icon.TabBarItem
            title='Notifications'
            iconName='ios-bell'
            selectedIconName='ios-bell'
            color='rgba(0,0,0,.3)'
            size={ 28 }
            selected={ this.state.selectedTab === tabs.Notifications }
            style={ styles.tabIcon }
            onPress={() => {
              this.setState({
                selectedTab: tabs.Notifications,
              });
            }}
          >
            { this._renderContent() }
          </Icon.TabBarItem>
          <Icon.TabBarItem
            title='More'
            iconName='ios-more'
            selectedIconName='ios-more'
            size={ 28 }
            color='rgba(0,0,0,.3)'
            selected={ this.state.selectedTab === tabs.More }
            onPress={() => {
              this.setState({
                selectedTab: tabs.More,
              });
            }}
          >
            { this._renderContent() }
          </Icon.TabBarItem>
        </TabBarIOS>
    );
  }
});

var styles = StyleSheet.create({
  tabBar: {
    height: 48,
    width: constants.width
  },
  tabIcon: {
  }
});

module.exports = MainTabBar;

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
var BevyNavigator = require('./../../../bevy/components/ios/BevyNavigator.ios.js');
var ChatNavigator = require('./../../../chat/components/ios/ChatNavigator.ios.js');
var MyBevies = require('./../../../bevy/components/ios/MyBevies.ios.js');
var NotificationNavigator =
  require('./../../../notification/components/ios/NotificationNavigator.ios.js');
var SettingsView = require('./../../../settings/components/ios/SettingsView.ios.js');
var SearchView = require('./SearchView.ios.js');

var constants = require('./../../../constants');
var routes = require('./../../../routes');
var NotificationStore = require('./../../../notification/NotificationStore');
var BevyStore = require('./../../../bevy/BevyStore');
var BEVY = constants.BEVY;

var tabs = {
  Bevies: 'BevyNavigator',
  Chat: 'ChatNavigator',
  Notifications: 'NotificationNavigator',
  More: 'SettingsNavigator',
  Search: 'SearchView'
};

var MainTabBar = React.createClass({
  getInitialState() {
    return {
      selectedTab: tabs.Bevies,
    };
  },

  componentDidMount() {
    BevyStore.on(BEVY.NAV_POSTVIEW, this.navPostView);
  },

  navPostView() {
    this.setState({
      selectedTab: tabs.Bevies,
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
      case tabs.Bevies:
        return (
          <MyBevies
            { ...this.props }
            bevyNavigator={ this.props.bevyNavigator }
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
      case tabs.Search:
        return (
          <SearchView
            {...this.props}
            tabBarActions={ tabBarActions }
          />
        )
        break;
    }
  },

  render() {
    return (
        <TabBarIOS
          tintColor='#2cb673'
          barTintColor='#FFF'
          translucent={ false }
          style={{borderTopWidth: 1, borderTopColor: '#eee'}}
        >
          <Icon.TabBarItem
            title='Home'
            iconName='ios-home-outline'
            selectedIconName='ios-home'
            color='rgba(0,0,0,.3)'
            size={ 28 }
            selected={ this.state.selectedTab === tabs.Bevies }
            style={ styles.tabIcon }
            onPress={() => {
              this.setState({
                selectedTab: tabs.Bevies,
              });
            }}
          >
            { this._renderContent() }
          </Icon.TabBarItem>
          <Icon.TabBarItem
            title='Search'
            iconName='ios-search'
            selectedIconName='ios-search-strong'
            color='rgba(0,0,0,.3)'
            size={ 28 }
            selected={ this.state.selectedTab === tabs.Search }
            style={ styles.tabIcon }
            onPress={() => {
              this.setState({
                selectedTab: tabs.Search,
              });
            }}
          >
            { this._renderContent() }
          </Icon.TabBarItem>
          <Icon.TabBarItem
            title='Chat'
            iconName='ios-chatbubble-outline'
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
            iconName='ios-bell-outline'
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
            iconName='ios-more-outline'
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

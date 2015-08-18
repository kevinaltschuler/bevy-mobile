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
  StatusBarIOS
} = React;
var {
  Icon,
  TabBarIOS
} = require('react-native-icons');

var BevyNavigator = require('./../../bevy/components/BevyNavigator.ios.js');
var ChatNavigator = require('./../../chat/components/ChatNavigator.ios.js');
var NotificationNavigator = require('./../../notification/components/NotificationNavigator.ios.js');
var SettingsView = require('./../../settings/components/SettingsView.ios.js');

var tabs = {
  Posts: 'BevyNavigator',
  Chat: 'ChatNavigator',
  Notifications: 'NotificationNavigator',
  More: 'SettingsNavigator'
};

var MainTabBar = React.createClass({

  getInitialState() {
    return {
      selectedTab: tabs.Posts
    };
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
          <View style={ styles.tabContent }>
            <BevyNavigator 
              { ...this.props } 
              tabBarActions={ tabBarActions }
            />
          </View>
        );
        break;
      case tabs.Chat:
        return (
          <View style={ styles.tabContent }>
            <ChatNavigator 
              { ...this.props } 
              tabBarActions={ tabBarActions }
            />
          </View>
        );
        break;
      case tabs.Notifications:
        return (
          <View style={ styles.tabContent }>
            <NotificationNavigator 
              { ...this.props } 
              tabBarActions={ tabBarActions }
            />
          </View>
        );
        break;
      case tabs.More:
        return (
          <View style={ styles.tabContent }>
            <SettingsView 
              { ...this.props } 
              tabBarActions={ tabBarActions } 
            />
          </View>
        );
    }
  },

  render() {
    return (
      <View style={styles.mainContainer}>
        <TabBarIOS tintColor={ 'black' } barTintColor={ 'white' } style={ styles.tabBar }>
          <TabBarIOS.Item
            title='Posts'
            iconName={ 'ion|ios-list-outline' }
            selected={ this.state.selectedTab === tabs.Posts }
            style={ styles.tabIcon }
            onPress={() => {
              this.setState({
                selectedTab: tabs.Posts
              });
            }}
          >
            { this._renderContent() }
          </TabBarIOS.Item>
          <TabBarIOS.Item
            title='Chat'
            iconName={ 'ion|ios-chatbubble-outline' }
            selected={ this.state.selectedTab === tabs.Chat }
            style={ styles.tabIcon }
            onPress={() => {
              this.setState({
                selectedTab: tabs.Chat
              });
            }}
          >
            { this._renderContent() }
          </TabBarIOS.Item>
          <TabBarIOS.Item
            title='Notifications'
            iconName={ 'ion|ios-bell-outline' }
            selected={ this.state.selectedTab === tabs.Notifications }
            style={ styles.tabIcon }
            onPress={() => {
              this.setState({
                selectedTab: tabs.Notifications
              });
            }}
          >
            { this._renderContent() }
          </TabBarIOS.Item>
          <TabBarIOS.Item
            title='More'
            iconName={ 'ion|ios-more-outline' }
            selected={ this.state.selectedTab === tabs.More }
            style={ styles.tabIcon }
            onPress={() => {
              this.setState({
                selectedTab: tabs.More
              });
            }}
          >
            { this._renderContent() }
          </TabBarIOS.Item>
        </TabBarIOS>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginTop: 0,
    flexDirection: 'column'
  },
  tabContent: {
    flex: 1
  },
  tabBar: {
    flex: 1,
    height: 48
  },
  tabIcon: {
    flex: 1
  }
});

module.exports = MainTabBar;

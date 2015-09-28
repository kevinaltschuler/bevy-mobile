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
        <TabBarIOS tintColor={ '#393939' } barTintColor={ 'white' } style={ styles.tabBar }>
          <TabBarIOS.Item
            title='Posts'
            iconName={'ion|ios-list-outline'}
            selectedIconName={'ion|ios-list'}
            selectedIconSize={28}
            selected={ this.state.selectedTab === tabs.Posts }
            style={ styles.tabIcon }
            onPress={() => {
              this.setState({
                selectedTab: tabs.Posts,
              });
            }}
          >
            { this._renderContent() }
          </TabBarIOS.Item>
          <TabBarIOS.Item
            title='Chat'
            iconName={'ion|ios-chatbubble-outline'}
            selectedIconName={'ion|ios-chatbubble'}
            selectedIconSize={28}
            selected={ this.state.selectedTab === tabs.Chat }
            style={ styles.tabIcon }
            onPress={() => {
              this.setState({
                selectedTab: tabs.Chat,
              });
            }}
          >
            { this._renderContent() }
          </TabBarIOS.Item>
          <TabBarIOS.Item
            title='Notifications'
            iconName={'ion|ios-bell-outline'}
            selectedIconName={'ion|ios-bell'}
            selectedIconSize={28}
            badge={NotificationStore.unread}
            selected={ this.state.selectedTab === tabs.Notifications }
            style={ styles.tabIcon }
            onPress={() => {
              this.setState({
                selectedTab: tabs.Notifications,
              });
            }}
          >
            { this._renderContent() }
          </TabBarIOS.Item>
          <TabBarIOS.Item
            title='More'
            iconName={'ion|ios-more-outline'}
            selectedIconName={'ion|ios-more'}
            selectedIconSize={28}
            selected={ this.state.selectedTab === tabs.More }
            style={ styles.tabIcon }
            onPress={() => {
              this.setState({
                selectedTab: tabs.More,
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
    height: 48,
  },
  tabIcon: {
    flex: 1,
  }
});

module.exports = MainTabBar;

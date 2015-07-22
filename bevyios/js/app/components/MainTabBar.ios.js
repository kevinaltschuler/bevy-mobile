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
var ProfileNavigator = require('./../../profile/components/ProfileNavigator.ios.js');

var MainTabBar = React.createClass({

  getInitialState() {
    return {
      selectedTab: 'BevyNavigator'
    };
  },

  _renderContent() {

    switch(this.state.selectedTab) {
      case 'BevyNavigator':
        return (
          <View style={styles.tabContent}>
            <BevyNavigator { ...this.props } />
          </View>
        );
        break;
      case 'ChatNavigator':
        return (
          <View style={styles.tabContent}>
            <ChatNavigator { ...this.props } />
          </View>
        );
        break;
      case 'NotificationNavigator':
        return (
          <View style={styles.tabContent}>
            <NotificationNavigator { ...this.props } />
          </View>
        );
        break;
      case 'ProfileNavigator':
        return (
          <View style={styles.tabContent}>
            <ProfileNavigator { ...this.props } />
          </View>
        );
        break;
    }
  },

  render() {
    return (
      <View style={styles.mainContainer}>
        <TabBarIOS tintColor={ 'black' } barTintColor={ 'white' } style={ styles.tabBar }>
          <TabBarIOS.Item
            title='Posts'
            iconName={ 'ion|ios-list-outline' }
            selected={ this.state.selectedTab === 'BevyNavigator' }
            style={ styles.tabIcon }
            onPress={() => {
              this.setState({
                selectedTab: 'BevyNavigator'
              });
            }}
          >
            { this._renderContent() }
          </TabBarIOS.Item>
          <TabBarIOS.Item
            title='Chat'
            iconName={ 'ion|ios-chatbubble-outline' }
            selected={ this.state.selectedTab === 'ChatNavigator' }
            style={ styles.tabIcon }
            onPress={() => {
              this.setState({
                selectedTab: 'ChatNavigator'
              });
            }}
          >
            { this._renderContent() }
          </TabBarIOS.Item>
          <TabBarIOS.Item
            title='Notifications'
            iconName={ 'ion|ios-bell-outline' }
            selected={ this.state.selectedTab === 'NotificationNavigator' }
            style={ styles.tabIcon }
            onPress={() => {
              this.setState({
                selectedTab: 'NotificationNavigator'
              });
            }}
          >
            { this._renderContent() }
          </TabBarIOS.Item>
          <TabBarIOS.Item
            title='Profile'
            iconName={ 'ion|ios-person-outline' }
            selected={ this.state.selectedTab === 'ProfileNavigator' }
            style={ styles.tabIcon }
            onPress={() => {
              this.setState({
                selectedTab: 'ProfileNavigator'
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
    flex: 1
  },
  tabIcon: {
    flex: 1
  }
});

module.exports = MainTabBar;

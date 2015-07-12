/**
 * tabBar.js
 * kevin made this
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Text,
  Image,
  View,
  CameraRoll
} = React;

var ios_person = require('image!ios-person');
var ios_person_outline = require('image!ios-person-outline');
var ios_bell = require('image!ios-bell');
var ios_bell_outline = require('image!ios-bell-outline');
var ios_chatbubble = require('image!ios-chatbubble');
var ios_chatbubble_outline = require('image!ios-chatbubble-outline');
var ios_list = require('image!ios-list');
var ios_list_outline = require('image!ios-list-outline');

var Icon = require('FAKIconImage');
var BevyNavigator = require('./../../BevyView/components/BevyNavigator.ios.js');
var ChatNavigator = require('./../../ChatView/components/ChatNavigator.ios.js');
var NotificationNavigator = require('./../../NotificationView/components/NotificationNavigator.ios.js');
var ProfileNavigator = require('./../../ProfileView/components/ProfileNavigator.ios.js');

var MainTabBar = React.createClass({

  getInitialState: function() {
    return {
      selectedTab: 'BevyNavigator'
    };
  },

  _renderContent: function() {

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

  render: function () {
      return (
        <View style={styles.mainContainer}>
          <TabBarIOS tintColor={ 'black' } barTintColor={ 'white' } style={ styles.tabBar }>
            <TabBarIOS.Item
              icon={ ios_list_outline }
              selectedIcon={ ios_list }
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
              icon={ ios_chatbubble_outline }
              selectedIcon={ ios_chatbubble }
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
              icon={ ios_bell_outline }
              selectedIcon={ ios_bell }
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
              icon={ ios_person_outline }
              selectedIcon={ ios_person }
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
    padding: 0,
    marginTop: 0,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  tabContent: {
    flex: 1,
  },
  tabBar: {
    flex: 1
  },
  tabIcon: {
    flex: 1
  },
  tabText: {
    color: 'black',
    margin: 50
  },
});

module.exports = MainTabBar;

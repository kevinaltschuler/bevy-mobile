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
  View,
  CameraRoll
} = React;

var Icon = require('FAKIconImage');
var SMXTabBarIOS = require('SMXTabBarIOS');
var SMXTabBarItemIOS = SMXTabBarIOS.Item;
var BevyNavigator = require('./../../BevyView/components/BevyNavigator.ios.js');
var ChatNavigator = require('./../../ChatView/components/ChatNavigator.ios.js');
var NotificationNavigator = require('./../../NotificationView/components/NotificationNavigator.ios.js');
var ProfileNavigator = require('./../../ProfileView/components/ProfileNavigator.ios.js');

var MainTabBar = React.createClass({

  statics: {
    title: '<TabBarIOS>',
    description: 'Tab-based navigation.'
  },

  getInitialState: function() {
    return {
      selectedTab: 'BevyNavigator',
      notifCount: 0,
      presses: 0,
    };
  },

  _renderContent: function() {

    if(this.state.selectedTab === 'BevyNavigator') {
      return (
        <View>
          <BevyNavigator { ...this.props } />
        </View>
      );
    }
    else if(this.state.selectedTab === 'ChatNavigator') {
      return (
        <View style={styles.tabContent}>
          <ChatNavigator />
        </View>
      );
    }
    else if(this.state.selectedTab === 'NotificationNavigator') {
      return (
        <View style={styles.tabContent}>
          <NotificationNavigator />
        </View>
      );
    }
    else if(this.state.selectedTab === 'ProfileNavigator') {
      return (
        <View style={styles.tabContent}>
          <ProfileNavigator navigator={this.props.navigator} />
        </View>
      );
    }
  },


  render: function () {
      var bevyIcon;
      var chatIcon;
      var notificationIcon;
      var personIcon;

      if(this.state.selectedTab == 'BevyNavigator') {
        bevyIcon = 'ion|ios-list';
      } else {
        bevyIcon = 'ion|ios-list-outline';
      }
      if(this.state.selectedTab == 'ChatNavigator') {
        chatIcon = 'ion|ios-chatbubble';
      } else {
        chatIcon = 'ion|ios-chatbubble-outline';
      }
      if(this.state.selectedTab == 'NotificationNavigator') {
        notificationIcon = 'ion|ios-bell';
      } else {
        notificationIcon = 'ion|ios-bell-outline';
      }
      if(this.state.selectedTab == 'ProfileNavigator') {
        personIcon = 'ion|ios-person';
      } else {
        personIcon = 'ion|ios-person-outline';
      }


      var bevyItem = (
          <SMXTabBarItemIOS
              name="BevyNavigator"
              iconName={bevyIcon}
              title={''}
              iconSize={32}
              selected={this.state.selectedTab === 'BevyNavigator'}
              onPress={() => {
              this.setState({
                selectedTab: 'BevyNavigator',
              });
            }}>
            {this._renderContent()}
          </SMXTabBarItemIOS>
        );
      var chatItem = (
          <SMXTabBarItemIOS
              name="ChatNavigator"
              iconName={chatIcon}
              title={''}
              iconSize={32}
              selected={this.state.selectedTab === 'ChatNavigator'}
              onPress={() => {
              this.setState({
                selectedTab: 'ChatNavigator',
              });
            }}>
            {this._renderContent()}
          </SMXTabBarItemIOS>
        );
      var notificationItem = (
          <SMXTabBarItemIOS
              name="NotificationNavigator"
              iconName={notificationIcon}
              title={''}
              iconSize={32}
              selected={this.state.selectedTab === 'NotificationNavigator'}
              onPress={() => {
              this.setState({
                selectedTab: 'NotificationNavigator',
              });
            }}>
            {this._renderContent()}
          </SMXTabBarItemIOS>
        );
      var profileItem = (
            <SMXTabBarItemIOS
                name="ProfileNavigator"
                iconName={personIcon}
                title={''}
                iconSize={32}
                selected={this.state.selectedTab === 'ProfileNavigator'}
                onPress={() => {
                this.setState({
                  selectedTab: 'ProfileNavigator',
                });
              }}>
              {this._renderContent()}
            </SMXTabBarItemIOS>
        );

      return (
        <View style={styles.mainContainer}>
          <SMXTabBarIOS
            selectedTab={this.state.selectedTab}
            tintColor={'black'}
            barTintColor={'white'}
            styles={styles.tabBar}
          >
            {bevyItem}
            {chatItem}
            {notificationItem}
            {profileItem}
          </SMXTabBarIOS>
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
  tabText: {
    color: 'black',
    margin: 50,
  },
});

module.exports = MainTabBar;

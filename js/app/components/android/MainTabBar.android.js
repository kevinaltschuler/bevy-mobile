/**
 * MainTabBar.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback
} = React;
var TabBarItem = require('./TabBarItem.android.js');
var SettingsView = require('./../../../settings/components/android/SettingsView');

var constants = require('./../../../constants');

var tabs = {
  posts: 'POSTS',
  chat: 'CHAT',
  notifications: 'NOTIFS',
  more: 'MORE'
};

var MainTabBar = React.createClass({

  getInitialState() {
    return {
      activeTab: tabs.posts
    };
  },

  _renderTabContent() {
    switch(this.state.activeTab) {
      case tabs.posts:
        return <Text>Posts Tab Here</Text>
        break;
      case tabs.chat:
        return <Text>Chat Tab Here</Text>
        break;
      case tabs.notifications:
        return <Text>Notifications Tab Here</Text>
        break;
      case tabs.more:
        return <SettingsView { ...this.props } />
        break;
      default:
        break;
    }
    return <Text>Some Tab Content</Text>
  },

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.tabBar }>
          <TabBarItem 
            tab={ tabs.posts }
            activeTab={ this.state.activeTab }
            onPress={() => this.setState({ activeTab: tabs.posts }) } 
            content='Posts'
          />
          <TabBarItem 
            tab={ tabs.chat }
            activeTab={ this.state.activeTab }
            onPress={() => this.setState({ activeTab: tabs.chat }) } 
            content='Chat'
          />
          <TabBarItem 
            tab={ tabs.notifications }
            activeTab={ this.state.activeTab }
            onPress={() => this.setState({ activeTab: tabs.notifications }) } 
            content='Notifications'
          />
          <TabBarItem 
            tab={ tabs.more }
            activeTab={ this.state.activeTab }
            onPress={() => this.setState({ activeTab: tabs.more }) } 
            content='More'
          />
        </View>
        { this._renderTabContent() }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48
  },
  tabBar: {
    height: 48,
    width: constants.width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fff'
  }
});

module.exports = MainTabBar;
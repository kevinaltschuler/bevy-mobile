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
var ChatNavigator = require('./../../../chat/components/android/ChatNavigator.android.js');
var Icon = require('react-native-vector-icons/MaterialIcons');

var constants = require('./../../../constants');

var tabs = {
  posts: 'POSTS',
  chat: 'CHAT',
  notifications: 'NOTIFS',
  more: 'MORE'
};
var unselectedColor='#888';
var selectedColor='#FFF';
var iconSize = 24;

var MainTabBar = React.createClass({

  getInitialState() {
    return {
      activeTab: tabs.posts
    };
  },

  switchTab(tab) {
    this.setState({
      activeTab: tab
    });
  },

  _renderTabContent() {
    var tabActions = {
      switchTab: this.switchTab
    };
    switch(this.state.activeTab) {
      case tabs.posts:
        return <Text>Posts Tab Here</Text>
        break;
      case tabs.chat:
        return <ChatNavigator tabActions={ tabActions } { ...this.props } />;
        break;
      case tabs.notifications:
        return <Text>Notifications Tab Here</Text>
        break;
      case tabs.more:
        return <SettingsView tabActions={ tabActions } { ...this.props } />;
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
            icon={<Icon name='view-list' size={ iconSize } color={ unselectedColor } />}
            selectedIcon={<Icon name='view-list' size={ iconSize } color={ selectedColor } />}
          />
          <TabBarItem 
            tab={ tabs.chat }
            activeTab={ this.state.activeTab }
            onPress={() => this.setState({ activeTab: tabs.chat }) } 
            icon={<Icon name='chat-bubble' size={ iconSize } color={ unselectedColor } />}
            selectedIcon={<Icon name='chat-bubble' size={ iconSize } color={ selectedColor } />}
          />
          <TabBarItem 
            tab={ tabs.notifications }
            activeTab={ this.state.activeTab }
            onPress={() => this.setState({ activeTab: tabs.notifications }) } 
            icon={<Icon name='notifications' size={ iconSize } color={ unselectedColor } />}
            selectedIcon={<Icon name='notifications' size={ iconSize } color={ selectedColor } />}
          />
          <TabBarItem 
            tab={ tabs.more }
            activeTab={ this.state.activeTab }
            onPress={() => this.setState({ activeTab: tabs.more }) } 
            icon={<Icon name='more-horiz' size={ iconSize } color={ unselectedColor } />}
            selectedIcon={<Icon name='more-horiz' size={ iconSize } color={ selectedColor } />}
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
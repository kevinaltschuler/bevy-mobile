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
  BackAndroid,
  Animated,
  ViewPagerAndroid,
  TouchableNativeFeedback
} = React;
var TabBarItem = require('./TabBarItem.android.js');
var SettingsView = require('./../../../settings/components/android/SettingsView');
var ChatNavigator = require('./../../../chat/components/android/ChatNavigator.android.js');
var NotificationView = require('./../../../notification/components/android/NotificationView.android.js');
var BevyNavigator = require('./../../../bevy/components/android/BevyNavigator.android.js');
var Icon = require('react-native-vector-icons/MaterialIcons');

var _ = require('underscore');
var constants = require('./../../../constants');

var tabs = {
  posts: 'POSTS',
  chat: 'CHAT',
  notifications: 'NOTIFS',
  more: 'MORE'
};
var unselectedColor='#AAA';
var selectedColor='#2CB673';
var iconSize = 24;

var MainTabBar = React.createClass({
  propTypes: {
    unreadCount: React.PropTypes.number
  },

  getInitialState() {
    return {
      activeTab: tabs.posts,
      tabHistory: [tabs.posts], // keep track of tab switches so
                                // we can use the back button to switch
                                // to previous ones 
      barAnim: new Animated.ValueXY() // animated green bar that follows tabs
    };
  },

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.onBackButton);
  },
  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.onBackButton);
  },

  onBackButton() {
    var history = this.state.tabHistory;
    // if its already empty, then exit app
    if(_.isEmpty(history)) return false;
    var prevTab = history.pop();
    // if theres no more tabs to go back to, then exit app
    if(_.isEmpty(history)) return false;
    // else, go to the popped tab
    this.setState({
      activeTab: prevTab,
      tabHistory: history
    });
    return true;
  },

  onPageSelected(ev) {
    var index = ev.nativeEvent.position;
    var tab = '';
    switch(index) {
      case 0:
        tab = tabs.posts;
        break;
      case 1:
        tab = tabs.chat;
        break;
      case 2:
        tab = tabs.notifications;
        break;
      case 3:
        tab = tabs.more;
        break;
    }
    this.switchTab(tab);
  },

  switchTab(tab) {
    var history = this.state.tabHistory || [];
    history.push(tab);
    this.setState({
      activeTab: tab,
      tabHistory: history
    });

    var x = 0;
    switch(tab) {
      case tabs.posts:
        this.refs.Pager.setPage(0);
        x = 0;
        break;
      case tabs.chat:
        this.refs.Pager.setPage(1);
        x = (constants.width / 4);
        break;
      case tabs.notifications:
        this.refs.Pager.setPage(2);
        x = (constants.width / 4) * 2;
        break;
      case tabs.more:
        this.refs.Pager.setPage(3);
        x = (constants.width / 4) * 3;
        break;
    }

    // animate bar
    Animated.timing(
      this.state.barAnim,
      { 
        toValue: { x: x, y: 43 },
        duration: 150
      }
    ).start();
  },

  _renderTabContent() {
    var tabActions = {
      switchTab: this.switchTab
    };
    return (
      <ViewPagerAndroid
        ref='Pager'
        style={ styles.viewPager }
        initialPage={ 0 }
        keyboardDismissMode='on-drag'
        onPageScroll={() => {}}
        onPageSelected={ this.onPageSelected }
      >
        <View style={ styles.page }>
          <BevyNavigator tabActions={ tabActions } { ...this.props } />
        </View>
        <View style={ styles.page }>
          <ChatNavigator tabActions={ tabActions } { ...this.props } />
        </View>
        <View style={ styles.page }>
          <NotificationView tabActions={ tabActions } { ...this.props } />
        </View>
        <View style={ styles.page }>
          <SettingsView tabActions={ tabActions } { ...this.props } />
        </View>
      </ViewPagerAndroid>
    );
  },

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.tabBar }>
          <TabBarItem 
            tab={ tabs.posts }
            activeTab={ this.state.activeTab }
            onPress={() => this.switchTab(tabs.posts) } 
            icon={<Icon name='view-list' size={ iconSize } color={ unselectedColor } />}
            selectedIcon={<Icon name='view-list' size={ iconSize } color={ selectedColor } />}
          />
          <TabBarItem 
            tab={ tabs.chat }
            activeTab={ this.state.activeTab }
            onPress={() => this.switchTab(tabs.chat) } 
            icon={<Icon name='chat-bubble' size={ iconSize } color={ unselectedColor } />}
            selectedIcon={<Icon name='chat-bubble' size={ iconSize } color={ selectedColor } />}
          />
          <TabBarItem 
            tab={ tabs.notifications }
            activeTab={ this.state.activeTab }
            unreadCount={ this.props.unreadCount }
            onPress={() => this.switchTab(tabs.notifications) } 
            icon={<Icon name='notifications' size={ iconSize } color={ unselectedColor } />}
            selectedIcon={<Icon name='notifications' size={ iconSize } color={ selectedColor } />}
          />
          <TabBarItem 
            tab={ tabs.more }
            activeTab={ this.state.activeTab }
            onPress={() => this.switchTab(tabs.more) } 
            icon={<Icon name='more-horiz' size={ iconSize } color={ unselectedColor } />}
            selectedIcon={<Icon name='more-horiz' size={ iconSize } color={ selectedColor } />}
          />
          <Animated.View style={[ styles.animBar, this.state.barAnim.getLayout(), {
            top: 43
          } ]} />
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
  },
  animBar: {
    position: 'absolute',
    top: 43,
    left: 0,
    width: (constants.width / 4),
    height: 5,
    backgroundColor: '#2CB673'
  },
  viewPager: {
    flex: 1
  },
  page: {
    flex: 1
  }
});

module.exports = MainTabBar;
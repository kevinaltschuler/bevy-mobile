/**
 * MainTabBar.ios.js
 * @author albert
 * @author kevin
 * @flow
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
  AlertIOS
} = React;
var Icon = require('react-native-vector-icons/Ionicons');
var BevyNavigator = require('./../../../bevy/components/ios/BevyNavigator.ios.js');
var ChatNavigator = require('./../../../chat/components/ios/ChatNavigator.ios.js');
var MyBevies = require('./../../../bevy/components/ios/MyBevies.ios.js');
var NotificationView =
  require('./../../../notification/components/ios/NotificationView.ios.js');
var SettingsView = require('./../../../settings/components/ios/SettingsView.ios.js');
var SearchView = require('./SearchView.ios.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var NotificationStore = require('./../../../notification/NotificationStore');
var BevyStore = require('./../../../bevy/BevyStore');
var PostStore = require('./../../../post/PostStore');
var BEVY = constants.BEVY;

var tabs = {
  Bevies: 'BevyNavigator',
  Chat: 'ChatNavigator',
  Notifications: 'NotificationNavigator',
  More: 'SettingsNavigator',
  Search: 'SearchView'
};

var MainTabBar = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    bevyNavigator: React.PropTypes.object,
    initialThread: React.PropTypes.object,
    unreadNotes: React.PropTypes.number
  },

  getInitialState() {
    return {
      selectedTab: tabs.Bevies,
    };
  },

  switchTab(tabName) {
    this.setState({
      selectedTab: tabs[tabName]
    });
  },

  componentDidMount() {
    var note = NotificationStore.getInitialNote();
    if(!_.isEmpty(note)) {
      // notification for new message
      if(!_.isEmpty(note.thread)) {
        this.switchTab('Chat');
        ChatActions.switchThread(note.thread._id);
        this.props.mainNavigator.push(routes.MAIN.MESSAGEVIEW);
      }
      // notification for post
      if(!_.isEmpty(note.post_id)) {
        var post_id = note.post_id;
        var route = routes.MAIN.COMMENT;
        var post = PostStore.getPost(post_id);
        // if the post isnt already loaded, then load from the server
        if(_.isEmpty(post)) {
          fetch(constants.apiurl + '/posts/' + post_id)
          .then(res => res.json())
          .then(res => {
            console.log(res);
            if(!_.isObject(res) || _.isEmpty(res)) {
              // probably just got an error fetching the post
              AlertIOS.alert('Post not found');
              return;
            }
            post = res;
            console.log(post);
            route.post = post;
            this.props.mainNavigator.push(route);
          })
          .catch(err => {
            console.log(err);
          });
        } else {
          route.post = post;
          this.props.mainNavigator.push(route);
        }
      }
    }
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
            initialThread={ this.props.initialThread }
          />
        );
        break;
      case tabs.Notifications:
        return (
          <NotificationView
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

  renderNotificationIcon() {
    if(this.props.unreadNotes > 0) {
      return (
        <Icon.TabBarItem
          title='Notifications'
          iconName='android-notifications'
          selectedIconName='android-notifications'
          color='rgba(0,0,0,.2)'
          badge={ this.props.unreadNotes }
          selected={ this.state.selectedTab === tabs.Notifications }
          style={ styles.tabIcon }
          onPress={() => {
            this.setState({ selectedTab: tabs.Notifications });
          }}
        >
          { this._renderContent() }
        </Icon.TabBarItem>
      );
    } else {
      return (
        <Icon.TabBarItem
          title='Notifications'
          iconName='android-notifications'
          selectedIconName='android-notifications'
          color='rgba(0,0,0,.2)'
          selected={ this.state.selectedTab === tabs.Notifications }
          style={ styles.tabIcon }
          onPress={() => {
            this.setState({ selectedTab: tabs.Notifications });
          }}
        >
          { this._renderContent() }
        </Icon.TabBarItem>
      );
    }
  },

  render() {
    return (
        <TabBarIOS
          tintColor='#2CB673'
          barTintColor='#FFF'
          translucent={ false }
        >
          <Icon.TabBarItem
            title='Home'
            iconName='android-home'
            selectedIconName='android-home'
            color='rgba(0,0,0,.2)'
            selected={ this.state.selectedTab === tabs.Bevies }
            style={ styles.tabIcon }
            onPress={() => {
              this.setState({ selectedTab: tabs.Bevies });
            }}
          >
            { this._renderContent() }
          </Icon.TabBarItem>
          <Icon.TabBarItem
            title='Search'
            iconName='android-search'
            selectedIconName='android-search'
            color='rgba(0,0,0,.2)'
            selected={ this.state.selectedTab === tabs.Search }
            style={ styles.tabIcon }
            onPress={() => {
              this.setState({ selectedTab: tabs.Search });
            }}
          >
            { this._renderContent() }
          </Icon.TabBarItem>
          <Icon.TabBarItem
            title='Chat'
            iconName='android-textsms'
            selectedIconName='android-textsms'
            color='rgba(0,0,0,.2)'
            selected={ this.state.selectedTab === tabs.Chat }
            style={ styles.tabIcon }
            onPress={() => {
              this.setState({ selectedTab: tabs.Chat });
            }}
          >
            { this._renderContent() }
          </Icon.TabBarItem>
          { this.renderNotificationIcon() }
          <Icon.TabBarItem
            title='More'
            iconName='android-more-horizontal'
            selectedIconName='android-more-horizontal'
            size={ 28 }
            color='rgba(0,0,0,.3)'
            selected={ this.state.selectedTab === tabs.More }
            onPress={() => {
              this.setState({ selectedTab: tabs.More });
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

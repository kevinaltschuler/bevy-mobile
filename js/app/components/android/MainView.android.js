/**
 * MainView.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet
} = React;
var SearchBar = require('./SearchBar.android.js');
var LoginNavigator = require('./../../../login/components/android/LoginNavigator.android.js');
var MessageView = require('./../../../chat/components/android/MessageView.android.js');
var NewPostView = require('./../../../post/components/android/NewPostView.android.js');
var CommentView = require('./../../../post/components/android/CommentView.android.js');
var NewBevyView = require('./../../../bevy/components/android/NewBevyView.android.js');
var PublicProfileView = require('./../../../user/components/android/PublicProfileView.android.js');
var MapView = require('./../../../post/components/android/Map.android.js');
var SwitchAccountView = require('./../../../user/components/android/SwitchAccountView.android.js');
var NewThreadView = require('./../../../chat/components/android/NewThreadView.android.js');
var ThreadSettingsView
   = require('./../../../chat/components/android/ThreadSettingsView.android.js');

var ChatStore = require('./../../../chat/ChatStore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var CHAT = constants.CHAT;

var MainView = React.createClass({
  propTypes: {
    mainRoute: React.PropTypes.object,
    mainNavigator: React.PropTypes.object
  },

  getInitialState() {
    return {
    };
  },

  componentDidMount() {
    console.log('LISTENING TO SWITCH THREAD INTENT')
    ChatStore.on(CHAT.SWITCH_TO_THREAD_INTENT, this.showMessageView);
  },
  componentWillUnmount() {
    console.log('STOPPED LISTENING TO SWITCH THREAD INTENT')
    ChatStore.off(CHAT.SWITCH_TO_THREAD_INTENT, this.showMessageView);
  },

  showMessageView(thread_id) {
    console.log('SHOW MESSAGE VIEW', thread_id);
    this.props.mainNavigator.push(routes.MAIN.MESSAGEVIEW);
  },

  render() {
    switch(this.props.mainRoute.name) {
      case routes.MAIN.TABBAR.name:
        return (
          <SearchBar { ...this.props } />
        );
        break;
      case routes.MAIN.LOGIN.name:
        return (
          <LoginNavigator { ...this.props } />
        );
        break;
      case routes.MAIN.MESSAGEVIEW.name:
        return (
          <MessageView { ...this.props } />
        );
        break;
      case routes.MAIN.NEWPOST.name:
        return (
          <NewPostView { ...this.props } />
        );
        break;
      case routes.MAIN.COMMENT.name:
        return (
          <CommentView post={ this.props.mainRoute.post } { ...this.props } />
        );
        break;
      case routes.MAIN.NEWBEVY.name:
        return (
          <NewBevyView { ...this.props }/>
        );
        break;
      case routes.MAIN.PROFILE.name:
        return (
          <PublicProfileView routeUser={ this.props.mainRoute.user } { ...this.props }/>
        );
        break;
      case routes.MAIN.MAP.name:
        return (
          <MapView
            location={ this.props.mainRoute.location }
            { ...this.props }
          />
        );
      case routes.MAIN.SWITCHACCOUNT.name:
        return <SwitchAccountView { ...this.props } />;
        break;
      case routes.MAIN.NEWTHREAD.name:
        return <NewThreadView { ...this.props } />;
        break;
      case routes.MAIN.THREADSETTINGS.name:
        return <ThreadSettingsView { ...this.props } />;
        break;
      default:
        return (
          <View style={ styles.container }>
            <Text>Default Route</Text>
          </View>
        );
        break;
    }
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0'
  }
});

module.exports = MainView;
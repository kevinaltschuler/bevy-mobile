/**
 * MainView.ios.js
 * @author kevin
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View
} = React;

var NotificationStore = require('./../../../notification/NotificationStore');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');

var AppActions = require('./../../../app/AppActions');
var BevyActions = require('./../../../bevy/BevyActions');

var PostStore = require('./../../../post/PostStore');
var UserStore = require('./../../../user/UserStore');
var BevyStore = require('./../../../bevy/BevyStore');

var POST = constants.POST;
var USER = constants.USER;
var BEVY = constants.BEVY;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 0,
  },
});

var MainView = React.createClass({
  propTypes: {
    mainRoute: React.PropTypes.object,
    mainNavigator: React.PropTypes.object
  },

  getInitialState() {
    return {
      route: {},
      initialThread: {}
    };
  },

  componentDidMount() {
    UserStore.on(USER.LOGOUT, this._onLogout);
    UserStore.on(USER.TOKENS_LOADED, this._onTokens);
    BevyStore.on(BEVY.LOADED, this.onBevyLoaded);
  },
  componentWillUnmount() {
    UserStore.off(USER.LOGOUT, this._onLogout);
    UserStore.off(USER.TOKENS_LOADED, this._onTokens);
    BevyStore.off(BEVY.LOADED, this.onBevyLoaded);
  },

  _onLogout() {
    console.log('no user found. going to login view...');
    this.props.mainNavigator.replace({
      name: routes.MAIN.LOGIN
    });
  },

  _onTokens() {
    AppActions.load();
  },

  onBevyLoaded() {
    this.props.mainNavigator.push({name: routes.MAIN.BEVY });
  },

  render() {
    switch(this.props.mainRoute.name) {
      case routes.MAIN.EDITPOST:
        let EditPostView = require('./../../../post/components/ios/NewPostView.ios.js');
        return (
          <EditPostView
            { ...this.props }
            editing={ true }
            post={ this.props.mainRoute.post }
          />
        );
        break;
      case routes.MAIN.NEWPOST:
        let NewPostView = require('./../../../post/components/ios/NewPostView.ios.js');
        return (
          <NewPostView
            { ...this.props }
          />
        )
        break;

      case routes.MAIN.NEWBOARD:
        let NewBoardView = require('./../../../bevy/components/ios/NewBoardView.ios.js');
        return (
          <NewBoardView
            {...this.props}
          />
        );
        break;

      case routes.MAIN.COMMENT:
        let CommentView = require('./../../../post/components/ios/CommentView.ios.js');
        return (
          <CommentView
            post={ this.props.mainRoute.post }
            { ...this.props }
          />
        );
        break;

      case routes.MAIN.PROFILE:
        let ProfileView = require('./../../../user/components/ios/ProfileView.ios.js');
        return (
          <ProfileView
            profileUser={ this.props.mainRoute.profileUser }
            { ...this.props }
          />
        )
        break;

<<<<<<< HEAD
      case routes.MAIN.SETTINGSVIEW:
        let SettingsView = require('./../../../settings/components/ios/SettingsView');
          return (
            <SettingsView
              {...this.props}
            />
          )
        break;

      case routes.MAIN.MAP:
        let LocationView = require('./../../../shared/components/ios/LocationView.ios.js');
        return (
          <LocationView
            location={this.props.mainRoute.location || 'no location'}
            { ...this.props }
          />
        );
        break;

      case routes.MAIN.INVITEUSERS:
        let InviteUserView = require('./../../../bevy/components/ios/InviteUserView.ios.js');
        return (
          <InviteUserView
            { ...this.props }
          />
        );
        break;

      case routes.MAIN.WEBVIEW:
        let Browser = require('./Browser.ios.js');
        return (
          <Browser
            initialURL={ this.props.mainRoute.initialURL }
            { ...this.props }
          />
        );
        break;

      case routes.MAIN.FEEDBACK:
        let FeedbackView = require('./../../../settings/components/ios/FeedbackView.ios.js');
        return (
          <FeedbackView
            { ...this.props }
          />
        );
        break;

      case routes.MAIN.PATCHNOTES:
        let PatchNotesView = require('./../../../settings/components/ios/PatchNotesView.ios.js');
        return (
          <PatchNotesView
            { ...this.props }
          />
        );
        break;

      case routes.MAIN.BEVY:
        let BevyNavigator = require('./../../../bevy/components/ios/BevyNavigator.ios.js');
        return (
          <BevyNavigator
            { ...this.props }
          />
        );
        break;

      case routes.MAIN.LOADING:
        let Loading = require('./Loading.ios.js');
        return (
          <Loading
            {...this.props}
          />
        );
        break;

      case routes.MAIN.LOGIN:
        let LoginNavigator = require('./../../../login/components/ios/LoginNavigator.ios.js');
        return (
          <LoginNavigator
            { ...this.props }
          />
        );
        break;

      default:
        return (
          <View>
            <Text>UNKNOWN ROUTE SUPPLIED</Text>
          </View>
        );
        break;
    }
  }
});

var styles = StyleSheet.create({
});

//module.ESPORTS LOL
module.exports = MainView;

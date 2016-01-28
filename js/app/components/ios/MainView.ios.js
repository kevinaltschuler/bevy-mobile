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

var MainTabBar = require('./MainTabBar.ios.js');
var LocationView = require('./../../../shared/components/ios/LocationView.ios.js');
var NewPostView = require('./../../../post/components/ios/NewPostView.ios.js');
var NewBevyView = require('./../../../bevy/components/ios/NewBevyView.ios.js');
var NewBoardView = require('./../../../bevy/components/ios/NewBoardView.ios.js');
var CommentView = require('./../../../post/components/ios/CommentView.ios.js');
var ProfileView = require('./../../../user/components/ios/ProfileView.ios.js');
var BevyNavigator = require('./../../../bevy/components/ios/BevyNavigator.ios.js');
var LoginNavigator = require('./../../../login/components/ios/LoginNavigator.ios.js');
var Loading = require('./Loading.ios.js');
var NewThreadView = require('./../../../chat/components/ios/NewThreadView.ios.js');
var InviteUserView = require('./../../../bevy/components/ios/InviteUserView.ios.js');
var Browser = require('./Browser.ios.js');
var FeedbackView = require('./../../../settings/components/ios/FeedbackView.ios.js');
var PatchNotesView = require('./../../../settings/components/ios/PatchNotesView.ios.js');
var MessageView = require('./../../../chat/components/ios/MessageView.ios.js');
var ThreadSettingsView = require('./../../../chat/components/ios/ThreadSettingsView.ios.js');
var AddPeopleView = require('./../../../chat/components/ios/AddPeopleView.ios.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var AppActions = require('./../../../app/AppActions');
var PostStore = require('./../../../post/PostStore');
var UserStore = require('./../../../user/UserStore');
var POST = constants.POST;
var USER = constants.USER;

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
    UserStore.on(USER.LOADED, this._onLogin);
    UserStore.on(USER.LOGOUT, this._onLogout);
    UserStore.on(USER.TOKENS_LOADED, this._onTokens);
  },

  componentWillUnmount() {
    UserStore.off(USER.LOADED, this._onLogin);
    UserStore.off(USER.LOGOUT, this._onLogout);
    UserStore.off(USER.TOKENS_LOADED, this._onTokens);
  },

  _onLogin() {

  },

  _onLogout() {
    console.log('no user found. going to login view...');
    this.props.mainNavigator.replace({
      name: routes.MAIN.LOGIN
    });
  },

  _onTokens() {
    console.log('got the tokens, loading app');
    this.props.mainNavigator.replace({
      name: routes.MAIN.TABBAR
    });
    AppActions.load();
  },

  render() {
    switch(this.props.mainRoute.name) {
      case routes.MAIN.EDITPOST:
        return (
          <NewPostView
            { ...this.props }
            editing={ true }
            post={ this.props.mainRoute.post }
          />
        );
        break;
      case routes.MAIN.NEWPOST:
        return <NewPostView { ...this.props } />;
        break;

      case routes.MAIN.NEWBEVY:
        return <NewBevyView { ...this.props } />;
        break;

      case routes.MAIN.NEWBOARD:
        return <NewBoardView {...this.props}/>;
        break;

      case routes.MAIN.COMMENT:
        return (
          <CommentView
            post={ this.props.mainRoute.post }
            { ...this.props }
          />
        );
        break;

      case routes.MAIN.PROFILE:
        return (
          <ProfileView
            profileUser={ this.props.mainRoute.profileUser }
            { ...this.props }
          />
        )
        break;

      case routes.MAIN.MAP:
        return (
          <LocationView
            location={this.props.mainRoute.location || 'no location'}
            { ...this.props }
          />
        );
        break;

      case routes.MAIN.BEVYNAV:
        return (
          <BevyNavigator
            { ...this.props }
          />
        );
        break;
      case routes.MAIN.NEWTHREAD:
        return (
          <NewThreadView
            defaultUser={this.props.mainRoute.defaultUser}
            { ...this.props }
          />
        );
        break;

      case routes.MAIN.INVITEUSERS:
        return <InviteUserView { ...this.props }/>
        break;

      case routes.MAIN.WEBVIEW:
        return (
          <Browser
            initialURL={ this.props.mainRoute.initialURL }
            { ...this.props }
          />
        );
        break;

      case routes.MAIN.FEEDBACK:
        return <FeedbackView { ...this.props } />;
        break;

      case routes.MAIN.PATCHNOTES:
        return <PatchNotesView { ...this.props } />;
        break;

      case routes.MAIN.TABBAR:
        return (
          <MainTabBar
            { ...this.props }
            initialThread={this.state.initialThread}
            clearInitialThread={() => {
              this.setState({
                initialThread: {}
              })
            }}
          />
        );

      case routes.MAIN.MESSAGEVIEW:
        return <MessageView {...this.props }/>
        break;

      case routes.MAIN.THREADSETTINGS:
        return (
          <ThreadSettingsView
            { ...this.props }
          />
        );
        break;

      case routes.MAIN.ADDPEOPLE:
        return (
          <AddPeopleView
            { ...this.props }
          />
        );
        break;

      case routes.MAIN.LOADING:
        return <Loading {...this.props} />
        break;

      case routes.MAIN.LOGIN:
      default:
        return <LoginNavigator { ...this.props } />;
        break;
    }
  }
});

var styles = StyleSheet.create({
});

//module.ESPORTS LOL
module.exports = MainView;

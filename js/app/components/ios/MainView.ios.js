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
var CreateBevyView = require('./../../../bevy/components/ios/CreateBevyView.ios.js');
var NewBoardView = require('./../../../bevy/components/ios/NewBoardView.ios.js');
var CommentView = require('./../../../post/components/ios/CommentView.ios.js');
var ProfileView = require('./../../../user/components/ios/ProfileView.ios.js');
var BevyNavigator = require('./../../../bevy/components/ios/BevyNavigator.ios.js');
var LoginNavigator = require('./../../../login/components/ios/LoginNavigator.ios.js');
var Loading = require('./Loading.ios.js');
var NewThreadView = require('./../../../chat/components/ios/NewThreadView.ios.js');
var InviteUserView = require('./../../../bevy/components/ios/InviteUserView.ios.js');

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
      route: {}
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
    this.props.mainNavigator.replace(routes.MAIN.TABBAR);
  },

  _onLogout() {
    this.props.mainNavigator.replace(routes.MAIN.LOGIN);
  },

  _onTokens() {
    console.log('got the tokens, loading app');
    AppActions.load();
  },

  render() {

    switch(this.props.mainRoute.name) {
      case routes.MAIN.NEWPOST.name:
        return <NewPostView { ...this.props } />;
        break;

      case routes.MAIN.NEWBEVY.name:
        return <CreateBevyView { ...this.props } />;
        break;

      case routes.MAIN.NEWBOARD.name:
        return <NewBoardView {...this.props}/>;
        break;

      case routes.MAIN.COMMENT.name:
        return (
          <CommentView
            postID={ this.props.mainRoute.postID || '-1' }
            { ...this.props }
          />
        );
        break;

      case routes.MAIN.PROFILE.name:
        return (
          <ProfileView
            profileUser={ this.props.mainRoute.profileUser }
            { ...this.props }
          />
        )
        break;

      case routes.MAIN.MAP.name:
        return (
          <LocationView
            location={this.props.mainRoute.location || 'no location'}
            { ...this.props }
          />
        );
        break;

      case routes.MAIN.EDITPOST.name:
        return (
          <PostEditView
            post={this.props.mainRoute.post}
            { ...this.props }
          />
        );
        break;

      case routes.MAIN.BEVYNAV.name:
        return (
          <BevyNavigator
            { ...this.props }
          />
        );
        break;
      case routes.MAIN.NEWTHREAD.name:
        return (
          <NewThreadView
            { ...this.props }
          />
        );
        break;

      case routes.MAIN.INVITEUSERS.name:
        return <InviteUserView { ...this.props }/>
        break;

      case routes.MAIN.TABBAR.name:
        return <MainTabBar { ...this.props } />
        break;

      case routes.MAIN.LOADING.name:
        return <Loading {...this.props} />
        break;

      case routes.MAIN.LOGIN.name:
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

/**
 * MainView
 * made by kev doggity dizzle
 */
'use strict';
var React = require('react-native');
var {
  StyleSheet,
  Text,
  View
} = React;
var MainTabBar = require('./MainTabBar.ios.js');
var SearchBar = require('./../../../shared/components/ios/SearchBar.ios.js');
var LocationView = require('./../../../shared/components/ios/LocationView.ios.js');
var NewPostView = require('./../../../post/components/ios/NewPostView.ios.js');
var CreateBevyView = require('./../../../bevy/components/ios/CreateBevyView.ios.js');
var CommentView = require('./../../../post/components/ios/CommentView.ios.js');
var ProfileView = require('./../../../user/components/ios/ProfileView.ios.js');
var SwitchUserView = require('./../../../user/components/ios/SwitchUserView.ios.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var PostStore = require('./../../../post/PostStore');
var UserStore = require('./../../../user/UserStore');
var POST = constants.POST;

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

  render() {

    switch(this.props.mainRoute.name) {

      case routes.MAIN.NEWPOST.name:
        return <NewPostView { ...this.props } />;
        break;

      case routes.MAIN.NEWBEVY.name:
        return <CreateBevyView { ...this.props } />;
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
        return <ProfileView profileUser={ this.props.mainRoute.profileUser } { ...this.props } />
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

      case routes.PROFILE.SWITCH_USER.name:
        return (
          <SwitchUserView
            user={this.props.mainRoute.profileUser }
            linkedAccounts={UserStore.getLinkedAccounts()}
            { ...this.props }
           />
        );
        break;
        
      case routes.MAIN.TABBAR.name:
      default:
        return <SearchBar { ...this.props } />
        break;
    }
  }
});

var styles = StyleSheet.create({
});

//module.ESPORTS LOL
module.exports = MainView;

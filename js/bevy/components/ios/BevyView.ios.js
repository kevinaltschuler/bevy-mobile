/**
 * BevyView.ios.js
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var PostList = require('./../../../post/components/ios/PostList.ios.js');
var BevyNavbar = require('./BevyNavbar.ios.js');
var BoardCard = require('./BoardCard.ios.js');
var BevyActionButtons = require('./BevyActionButtons');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var StatusBarSizeIOS = require('react-native-status-bar-size');

var BevyView = React.createClass({
  propTypes: {
    allPosts: React.PropTypes.array,
    activeBevy: React.PropTypes.object,
    activeBoard: React.PropTypes.object,
    user: React.PropTypes.object,
    myBevies: React.PropTypes.array,
    mainNavigator: React.PropTypes.object,
    mainRoute: React.PropTypes.object,
    sideMenuActions: React.PropTypes.object
  },

  goBack() {
    this.props.mainNavigator.pop();
  },

  toggleSideMenu() {
    this.props.sideMenuActions.toggle();
  },

  _renderBackButton() {
    return (
      <TouchableOpacity
        activeOpacity={ 0.5 }
        style={ styles.backButton }
        onPress={ this.goBack }
      >
        <Icon
          name='arrow-back'
          size={ 30 }
          color='#FFF'
        />
      </TouchableOpacity>
    );
  },

  _renderMenuButton() {
    return (
      <TouchableOpacity
        underlayColor={0.5}
        style={ styles.sideMenuButton }
        onPress={ this.toggleSideMenu }
      >
          <Icon
            name='menu'
            size={ 30 }
            color='#FFF'
          />
      </TouchableOpacity>
    );
  },

  _renderBoardCard() {
    if(_.isEmpty(this.props.activeBoard)) return <View />;
    return (
      <BoardCard
        user={ this.props.user }
        board={ this.props.activeBoard }
      />
    );
  },

  _renderBevyActions() {
    if(!_.isEmpty(this.props.activeBoard)) return <View />;
    return (
      <BevyActionButtons
        bevy={ this.props.activeBevy }
        user={ this.props.user }
        mainNavigator={ this.props.mainNavigator }
        bevyNavigator={ this.props.bevyNavigator }
      />
    );
  },

  render() {
    return (
      <View style={ styles.container }>
        <BevyNavbar
          activeBevy={ this.props.activeBevy }
          activeBoard={ this.props.activeBoard }
          left={ this._renderBackButton() }
          center={ this.props.activeBevy.name }
          right={ this._renderMenuButton() }
        />
        { this._renderBoardCard() }
        { this._renderBevyActions() }
        <PostList
          allPosts={ this.props.allPosts }
          activeBevy={ this.props.activeBevy }
          activeBoard={ this.props.activeBoard }
          user={ this.props.user }
          showNewPostCard={ false }
          myBevies={ this.props.myBevies }
          mainNavigator={ this.props.mainNavigator }
          mainRoute={ this.props.mainRoute }
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE'
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    height: 40,
    paddingHorizontal: 8
  },
  sideMenuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    height: 40,
    paddingHorizontal: 8
  }
});

module.exports = BevyView;

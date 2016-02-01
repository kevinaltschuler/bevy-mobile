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
  Animated,
  DeviceEventEmitter,
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
var BoardActions = require('./../../../bevy/BoardActions');
var PostActions = require('./../../../post/PostActions');
var PostStore = require('./../../../post/PostStore');
var POST = constants.POST;

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

  getInitialState() {
    return {
      menuButtonRotation: new Animated.Value(0),
      useSearchPosts: false,
      keyboardSpace: 0
    };
  },

  componentWillReceiveProps(nextProps) {
    if(nextProps.sideMenuActions.isOpen()) {
      // close side menu
      Animated.timing(
        this.state.menuButtonRotation, {
          toValue: 1,
          duration: 300
        }
      ).start()
    } else {
      // open side menu
      Animated.timing(
        this.state.menuButtonRotation, {
          toValue: 0,
          duration: 300
        }
      ).start()
    }
  },

  componentDidMount() {
    this.keyboardWillShowSub = DeviceEventEmitter.addListener('keyboardWillShow', this.onKeyboardShow);
    this.keyboardWillHideSub = DeviceEventEmitter.addListener('keyboardWillHide', this.onKeyboardHide);
  },
  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  },

  onKeyboardShow(frames) {
    if(frames.end) {
      this.setState({ keyboardSpace: frames.end.height });
    } else {
      this.setState({ keyboardSpace: frames.endCoordinates.height });
    }
  },
  onKeyboardHide(frames) {
    this.setState({ keyboardSpace: 0 });
  },

  onSearchStart() {
    this.setState({ useSearchPosts: true });
    this.PostList.switchToSearch();
  },
  onSearchStop() {
    this.setState({ useSearchPosts: false });
    this.PostList.switchBackFromSearch();
  },

  goBack() {
    if(!_.isEmpty(this.props.activeBoard)) {
      this.clearBoard();
      return;
    }
    this.props.mainNavigator.pop();
  },

  clearBoard() {
    BoardActions.clearBoard();
    PostActions.fetch(this.props.activeBevy._id, null);
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
    if(!_.isEmpty(this.props.activeBevy)) {
      if(this.props.activeBevy.settings.privacy == 'Private') {
        if(!_.contains(this.props.user.bevies, this.props.activeBevy._id)) {
          return <View />;
        }
      }
    }
    return (
      <Animated.View style={{
        transform: [{
          rotate: this.state.menuButtonRotation.interpolate({
            inputRange: [0, 1],
            outputRange: [ '0deg', '90deg' ]
          })
        }]
      }}>
        <TouchableOpacity
          underlayColor={ 0.5 }
          style={ styles.sideMenuButton }
          onPress={ this.toggleSideMenu }
        >
          <Icon
            name='menu'
            size={ 30 }
            color='#FFF'
          />
        </TouchableOpacity>
      </Animated.View>
    );
  },

  _renderBevyActions() {
    if(!_.isEmpty(this.props.activeBoard)) return <View />;
    if(!_.isEmpty(this.props.activeBevy)) {
      if(this.props.activeBevy.settings.privacy == 'Private') {
        if(!_.contains(this.props.user.bevies, this.props.activeBevy._id)) {
          return <View />;
        }
      }
    }
    return (
      <BevyActionButtons
        bevy={ this.props.activeBevy }
        activeBoard={ this.props.activeBoard }
        user={ this.props.user }
        mainNavigator={ this.props.mainNavigator }
        bevyNavigator={ this.props.bevyNavigator }
        onSearchStart={ this.onSearchStart }
        onSearchStop={ this.onSearchStop }
      />
    );
  },

  render() {

    return (
      <View style={[ styles.container, {
        marginBottom: this.state.keyboardSpace
      }]}>
        <BevyNavbar
          activeBevy={ this.props.activeBevy }
          activeBoard={ this.props.activeBoard }
          left={ this._renderBackButton() }
          center={ this.props.activeBevy.name }
          right={ this._renderMenuButton() }
          user={ this.props.user }
        />
        { this._renderBevyActions() }
        <PostList
          ref={ ref => { this.PostList = ref; }}
          allPosts={ this.props.posts }
          activeBevy={ this.props.activeBevy }
          activeBoard={ this.props.activeBoard }
          user={ this.props.user }
          myBevies={ this.props.myBevies }
          mainNavigator={ this.props.mainNavigator }
          mainRoute={ this.props.mainRoute }
          bevyNavigator={ this.props.bevyNavigator }
          useSearchPosts={ this.state.useSearchPosts }
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

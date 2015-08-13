/**
 * ChatView.js
 * kevin made this 
 * SMASH 4 SUCKS 
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Animated,
  TouchableHighlight,
  TouchableWithoutFeedback
} = React;

var ChatMenu = require('./ChatMenu.ios.js');
var MessageView = require('./MessageView.ios.js');

var _ = require('underscore');
var window = require('Dimensions').get('window');
var constants = require('./../../constants');
var StatusBarSizeIOS = require('react-native-status-bar-size');

var menuOffset = 50;
var menuWidth = constants.width * 3 / 4;

var ChatView = React.createClass({

  propTypes: {
    chatRoute: React.PropTypes.object,
    chatNavigator: React.PropTypes.object,
    allThreads: React.PropTypes.array,
    activeThread: React.PropTypes.object,
    user: React.PropTypes.object
  },

  getInitialState() {
    return {
      containerHeight: constants.height 
        - StatusBarSizeIOS.currentHeight // status bar
        - 48 // search bar
        - 40 // navbar
        - 48, // main tab bar
      menuRight: new Animated.Value(menuOffset - menuWidth),
      menuOpen: false,
      contentLeft: new Animated.Value(0)
    };
  },

  componentDidMount() {
    this.menuCloseAnimation = Animated.decay(this.state.menuRight, { velocity: -1.25 });
    this.menuOpenAnimation = Animated.decay(this.state.menuRight, { velocity: 1.25 });
  },

  openMenu() {
    this.menuCloseAnimation.stop();
    this.menuOpenAnimation.start();
    this.setState({
      menuOpen: true
    });
  },
  closeMenu() {
    this.menuOpenAnimation.stop();
    this.menuCloseAnimation.start();
    this.setState({
      menuOpen: false
    });
  },
  toggleMenu() {
    if(this.state.menuOpen) {
      this.closeMenu();
    } else {
      this.openMenu(); 
    }
  },

  getChatMenuActions() {
    return {
      openMenu: this.openMenu,
      closeMenu: this.closeMenu,
      toggleMenu: this.toggleMenu
    };
  },

  _renderMenuOverlay() {
    if(this.state.menuOpen) return null;
    return (
      <TouchableHighlight
        underlayColor='rgba(0,0,0,0.2)'
        onPress={() => {
          this.toggleMenu();
        }}
        style={{ 
          flex: 1,
          position: 'absolute',
          top: 0,
          left: 0,
          width: menuWidth,
          height: this.state.containerHeight
        }}
      >
        <View style={{
          flex: 1,
          width: menuWidth,
          height: this.state.containerHeight
        }}/>
      </TouchableHighlight>
    );
  },

  _renderMenu() {
    return (
      <Animated.View style={[ styles.menu, { 
        height: this.state.containerHeight,
        right: this.state.menuRight.interpolate({
          inputRange: [0, 100],
          outputRange: [menuOffset - menuWidth, 0],
          extrapolate: 'clamp'
        })
      } ]}>
        <ChatMenu { ...this.props } chatMenuActions={ this.getChatMenuActions() }/>
        { this._renderMenuOverlay() }
      </Animated.View>
    );
  },

  _renderContentOverlay() {
    if(!this.state.menuOpen) return null;
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.toggleMenu();
        }}
        style={{ 
          backgroundColor: 'transparent',
          flex: 1,
          position: 'absolute',
          top: 0,
          left: 0,
          width: window.width - menuWidth,
          height: this.state.containerHeight
        }}
      >
        <View 
          style={{
            backgroundColor: 'transparent',
            flex: 1,
            position: 'absolute',
            top: 0,
            left: 0,
            width: window.width - menuWidth,
            height: this.state.containerHeight
          }}
        />
      </TouchableWithoutFeedback>
    );
  },

  _renderContent() {
    var view;
    if(!this.props.loggedIn) {
      view = (
        <View style={ styles.infoView }>
          <Text style={ styles.infoViewText }>Sign In to Chat</Text>
        </View>
      );
    } else if(_.isEmpty(this.props.allThreads) && _.isEmpty(this.props.activeThread)) {
      // create a chat
      view = (
        <View style={ styles.infoView }>
          <Text style={ styles.infoViewText }>Create a Chat</Text>
        </View>
      );
    } else if (_.isEmpty(this.props.activeThread)) {
      // select a chat from the menu over there -->
      view = (
        <View style={ styles.infoView }>
          <Text style={ styles.infoViewText }>No Conversation Selected</Text>
          <Text style={ styles.infoViewText }>Select a Conversation From the Menu to the Right</Text>
          <Text style={ styles.infoViewText }>Or, Switch to a Bevy to View It's Chat</Text>
        </View>
      );
    } else {
      // display the chat messages
      view = (
        <MessageView { ...this.props }/>
      );
    }

    return (
      <Animated.View style={[ styles.content, { 
        height: this.state.containerHeight,
        left: this.state.contentLeft 
      } ]}>
        { view }
        { this._renderContentOverlay() }
      </Animated.View>
    );
  },

  render: function () {
    return (
      <View style={ styles.container }>
        { this._renderContent() }
        { this._renderMenu() }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    flex: 1,
    position: 'absolute',
    backgroundColor: '#fff',
    top: 0,
    flexDirection: 'column',
    width: menuWidth,
    shadowColor: 'black',
    shadowRadius: 1,
    shadowOpacity: .3,
    shadowOffset: { width: 0, height: 0 }
  },
  content: {
    flex: 1,
    position: 'absolute',
    backgroundColor: '#eee',
    top: 0,
    flexDirection: 'column',
    width: window.width - menuOffset
  },

  infoView: {
    flex: 1,
    flexDirection: 'column',
    padding: 15,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  infoViewText: {
    fontSize: 17,
    color: '#888',
    marginBottom: 15
  }
})

module.exports = ChatView;

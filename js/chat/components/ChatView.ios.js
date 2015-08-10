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

var window = require('Dimensions').get('window');
var StatusBarSizeIOS = require('react-native-status-bar-size');

var menuOffset = 50;
var menuWidth = window.width * 3 / 4;

var ChatView = React.createClass({

  propTypes: {
    chatRoute: React.PropTypes.object,
    chatNavigator: React.PropTypes.object,
    allThreads: React.PropTypes.array,
    user: React.PropTypes.object
  },

  getInitialState() {
    return {
      containerHeight: window.height 
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

  _renderMenuOverlay() {
    if(this.state.menuOpen) return null;
    return (
      <TouchableHighlight 
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
        <ChatMenu { ...this.props } />
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
          flex: 1,
          position: 'absolute',
          top: 0,
          left: 0,
          width: window.width - menuOffset,
          height: this.state.containerHeight
        }}
      >
        <View 
          style={{
            flex: 1,
            width: window.width - menuOffset,
            height: this.state.containerHeight
          }}
        />
      </TouchableWithoutFeedback>
    );
  },

  _renderContent() {
    return (
      <Animated.View style={[ styles.content, { 
        height: this.state.containerHeight,
        left: this.state.contentLeft 
      } ]}>
        { this._renderContentOverlay() }
      </Animated.View>
    );
  },

  render: function () {

    /*var threads = [];
    var allThreads = this.props.allThreads || [];
    allThreads.forEach(function(thread) {
      threads.push(
        <ThreadItem key={ thread._id } thread={ thread } chatRoute={ this.props.chatRoute } chatNavigator={ this.props.chatNavigator } user={ this.props.user }/>
      );
    }.bind(this));

    return (
      <View style={styles.container} >
        <ScrollView style={styles.scrollContainer}>
          { threads }
        </ScrollView>
      </View>
    );*/

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
    backgroundColor: '#f00',
    top: 0,
    flexDirection: 'column',
    width: menuWidth
  },
  content: {
    flex: 1,
    position: 'absolute',
    backgroundColor: '#0f0',
    top: 0,
    flexDirection: 'column',
    width: window.width - menuOffset
  },
  scrollContainer: {
    flex: 1,
    flexDirection: 'column'
  }
})

module.exports = ChatView;

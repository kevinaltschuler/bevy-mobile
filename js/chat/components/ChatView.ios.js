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
      contentLeft: new Animated.Value(0)
    };
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
          {/*<Text style={ styles.infoViewText }>Select a Conversation From the Menu to the Right</Text>
          <Text style={ styles.infoViewText }>Or, Switch to a Bevy to View It's Chat</Text>*/}
        </View>
      );
    } else {
      // display the chat messages
      view = (
        <MessageView { ...this.props }/>
      );
    }

    return (
      <View style={[ styles.content, { 
        height: this.state.containerHeight,
        left: 0 
      } ]}>
        { view }
      </View>
    );
  },

  render: function () {
    return (
      <View style={ styles.container }>
        { this._renderContent() }
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
  content: {
    flex: 1,
    position: 'absolute',
    backgroundColor: '#eee',
    top: 0,
    flexDirection: 'row',
    width: window.width
  },

  infoView: {
    flex: 1,
    flexDirection: 'column',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  infoViewText: {
    fontSize: 22,
    color: '#aaa',
    marginBottom: 15,
    marginLeft: 50,
    marginTop: 120
  }
})

module.exports = ChatView;

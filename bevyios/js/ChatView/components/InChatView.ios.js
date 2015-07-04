/**
 * InChatView.js
 * kevin made this 
 * dank nanr shake 
 */
'use strict';

var React = require('react-native');
var _ = require('underscore');
var {
  StyleSheet,
  Text,
  View,
  SegmentedControlIOS,
  ScrollView,
  ListView,
  TextInput,
  Image,
  createElement
} = React;

var KeyboardEvents = require('react-native-keyboardevents');
var KeyboardEventEmitter = KeyboardEvents.Emitter;

var ChatStore = require('./../ChatStore');
var ChatActions = require('./../ChatActions');

var constants = require('./../../constants');
var CHAT = constants.CHAT;

var RefreshingIndicator = require('./../../shared/components/RefreshingIndicator.ios.js');
var MessageItem = require('./MessageItem.ios.js');

var InChatView = React.createClass({

  propTypes: {
    chatRoute: React.PropTypes.object,
    chatNavigator: React.PropTypes.object,
    allThreads: React.PropTypes.array
  },

  getInitialState: function() {

    var activeThread = _.findWhere(this.props.allThreads, { 
      _id: this.props.chatRoute.activeThread 
    });
    var messages = ChatStore.getMessages(activeThread._id);
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    return {
      isRefreshing: false,
      keyboardSpace: 0,
      activeThread: activeThread,
      messages: messages,
      dataSource: ds.cloneWithRows(messages)
    };
  },

  componentDidMount: function() {
    ChatStore.on(CHAT.CHANGE_ONE + this.state.activeThread._id, this._onChatChange);

    KeyboardEventEmitter.on(KeyboardEvents.KeyboardDidShowEvent, (frames) => {
      this.setState({
        keyboardSpace: frames.end.height
      });
    });
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillHideEvent, (frames) => {
      this.setState({
        keyboardSpace: 0
      });
    });
  },

  componentWillUnmount: function() {
    ChatStore.off(CHAT.CHANGE_ONE + this.state.activeThread._id, this._onChatChange);
  },

  _onChatChange: function() {
    var messages = ChatStore.getMessages(this.state.activeThread._id);
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.setState({
      isRefreshing: false,
      messages: messages,
      dataSource: ds.cloneWithRows(messages)
    });
  },

  handleScroll: function(e) {
    var scrollY = e.nativeEvent.contentInset.top + e.nativeEvent.contentOffset.y;
    //console.log(scrollY);
    if(this.isTouching) {
      if(scrollY < -40) {
        if(!this.state.isRefreshing) {
          this.setState({
            isRefreshing: true
          });
          this.onRefresh();
        }
      }
    }
  },

  handleResponderGrant: function() {
    this.isTouching = true;
  },

  handleResponderRelease: function() {
    this.isTouching = false;
  },

  onRefresh: function() {
    ChatActions.fetchMore(this.state.activeThread._id);
  },

  renderHeader: function() {
    var refreshingIndicator = createElement(RefreshingIndicator, { description: 'Loading...' });
    if(this.state.isRefreshing)
      return refreshingIndicator;
    else
      return null;
  },

  render: function () {

    var allThreads = this.props.allThreads;

    var messages = [];
    this.state.messages.forEach(function(message) {
      messages.push(
        <MessageItem key={ message._id } message={ message } />
      );
    });

    var containerStyle = {
      flexDirection: 'column',
      flex: 1,
      justifyContent: 'flex-end',
      marginBottom: (this.state.keyboardSpace == 0) ? 50 : this.state.keyboardSpace,
    };

    return (
      <View style={ containerStyle } >
        <ListView
          style={ styles.scrollContainer }
          onScroll={ this.handleScroll }
          onResponderGrant={ this.handleResponderGrant }
          onResponderRelease={ this.handleResponderRelease }
          decelerationRate={ 0.9 }
          dataSource={ this.state.dataSource }
          renderRow={ (message) => (
            <MessageItem key={ message._id } message={ message } />
          )}
          renderHeader={ this.renderHeader }
        />
        <TextInput
          style={styles.textInput}
          placeholder={ 'Chat' }
          returnKeyType={ 'send' }
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#eee',
    paddingLeft: 10,
    paddingRight: 10,
  },
  textInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingLeft: 16,
    backgroundColor: '#fff',
    color: 'black'
  },
})

module.exports = InChatView;

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

var MessageView = React.createClass({

  propTypes: {
    chatRoute: React.PropTypes.object,
    chatNavigator: React.PropTypes.object,
    allThreads: React.PropTypes.array,
    activeThread: React.PropTypes.object,
    user: React.PropTypes.object
  },

  getInitialState: function() {

    var messages = ChatStore.getMessages(this.props.activeThread._id);
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    return {
      isRefreshing: false,
      keyboardSpace: 0,
      messageValue: '',
      messages: messages,
      dataSource: ds.cloneWithRows(messages)
    };
  },
  
  componentWillReceiveProps(nextProps: Object) {
    if(this.props.activeThread._id != nextProps.activeThread._id) {
      // switched threads
      console.log('switched threads');
    }
  },

  componentDidMount: function() {
    ChatStore.on(CHAT.CHANGE_ONE + this.props.activeThread._id, this._onChatChange);

    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillShowEvent, (frames) => {
      console.log(frames.end.height);
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
    ChatStore.off(CHAT.CHANGE_ONE + this.props.activeThread._id, this._onChatChange);
  },

  _onChatChange: function() {
    var messages = ChatStore.getMessages(this.props.activeThread._id);
    this.setState({
      isRefreshing: false,
      messages: messages,
      dataSource: this.state.dataSource.cloneWithRows(messages)
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
    ChatActions.fetchMore(this.props.activeThread._id);
  },

  onChange: function(ev) {
    var text = ev.nativeEvent.text;
    this.setState({
      messageValue: text
    });
  },

  onSubmitEditing: function(ev) {
    var text = ev.nativeEvent.text;
    var user = this.props.user;
    ChatActions.postMessage(this.props.activeThread._id, user, text);
    this.setState({
      messageValue: ''
    });

    // instant gratification
    var messages = this.state.messages;
    messages.push({
      _id: Date.now(),
      author: user,
      body: text,
      created: Date.now()
    });
    this.setState({
      messages: messages,
      dataSource: this.state.dataSource.cloneWithRows(messages)
    });
  },

  renderHeader: function() {
    var refreshingIndicator = createElement(RefreshingIndicator, { description: 'Loading...' });
    if(this.state.isRefreshing)
      return refreshingIndicator;
    else
      return null;
  },

  render: function () {

    return (
      <View style={[ styles.container, {
        marginBottom: (this.state.keyboardSpace == 0) ? 0 : this.state.keyboardSpace - 48 // tab bar height
      } ]} >
        <ListView
          ref='messageList'
          style={ styles.scrollContainer }
          onScroll={ this.handleScroll }
          onResponderGrant={ this.handleResponderGrant }
          onResponderRelease={ this.handleResponderRelease }
          decelerationRate={ 0.9 }
          dataSource={ this.state.dataSource }
          renderRow={ (message) => (
            <MessageItem key={ message._id } message={ message } user={ this.props.user }/>
          )}
          renderHeader={ this.renderHeader }
        />
        <TextInput
          style={[ styles.textInput ]}
          placeholder={ 'Chat' }
          value={ this.state.messageValue }
          returnKeyType={ 'send' }
          onChange={ this.onChange }
          onSubmitEditing={ this.onSubmitEditing }
          clearButtonMode={ 'while-editing' }
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end'
  },
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
    color: '#000'
  },
})

module.exports = MessageView;

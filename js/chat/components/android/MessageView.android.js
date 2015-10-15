/**
 * MessageView.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  ListView,
  Text,
  TextInput,
  TouchableNativeFeedback,
  StyleSheet
} = React;
var ChatBar = require('./ChatBar.android.js');
var MessageItem = require('./MessageItem.android.js');
var InvertibleScrollView = require('react-native-invertible-scroll-view');

var _ = require('underscore');
var constants = require('./../../../constants');
var CHAT = constants.CHAT;
var ChatStore = require('./../../ChatStore');
var ChatActions = require('./../../ChatActions');

var MessageView = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    activeThread: React.PropTypes.object,
    user: React.PropTypes.object,
    loggedIn: React.PropTypes.bool
  },

  getInitialState() {
    var messages = ChatStore.getMessages(this.props.activeThread._id);
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      messages: messages,
      dataSource: ds.cloneWithRows(messages),
      messageInput: ''
    };
  },

  componentDidMount() {
    ChatStore.on(CHAT.CHANGE_ONE + this.props.activeThread._id, this._onChatChange);
  },
  componentWillUnmount() {
    ChatStore.off(CHAT.CHANGE_ONE + this.props.activeThread._id, this._onChatChange);
  },

  componentWillReceiveProps(nextProps) {
    var messages = ChatStore.getMessage(nextProps.activeThread._id)
    this.setState({
      messages: messages,
      dataSource: this.state.dataSource.cloneWithRows(messages)
    });
  },

  _onChatChange: function() {
    var messages = ChatStore.getMessages(this.props.activeThread._id);
    this.setState({
      messages: messages,
      dataSource: this.state.dataSource.cloneWithRows(messages)
    });
  },

  onSubmitEditing: function(ev) {
    var text = this.state.messageInput;
    if(_.isEmpty(text)) return;

    var user = this.props.user;
    ChatActions.postMessage(this.props.activeThread._id, user, text);
    this.setState({
      messageInput: ''
    });

    // instant gratification
    var messages = this.state.messages;
    messages.unshift({
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

  _renderInput() {
    return (
      <View style={ styles.inputContainer }>
        <TextInput
          ref='MessageInput'
          value={ this.state.messageInput }
          style={ styles.messageInput }
          onChangeText={(text) => this.setState({ messageInput: text })}
          onSubmitEditing={ this.onSubmitEditing }
          placeholder='Chat'
          placeholderTextColor='#AAA'
          underlineColorAndroid='#AAA'
        />
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#888', false) }
          onPress={ this.onSubmitEditing }
        >
          <View style={ styles.sendMessageButton }>
            <Text style={ styles.sendMessageButtonText }>Send</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  },

  render() {
    return (
      <View style={ styles.container }>
        <ChatBar
          activeThread={ this.props.activeThread }
          mainNavigator={ this.props.mainNavigator }
        />
        <ListView
          renderScrollComponent={(props) => <InvertibleScrollView {...props} />}
          dataSource={ this.state.dataSource }
          style={ styles.messageList }
          renderRow={(message) => {
            return (
              <MessageItem
                key={ 'message:' + message._id }
                message={ message }
                user={ this.props.user }
              />
            );
          }}
        />
        { this._renderInput() }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: '#EEE'
  },
  messageList: {
    flexDirection: 'column',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10
  },
  inputContainer: {
    height: 48,
    width: constants.width,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 8,
  },
  messageInput: {
    flex: 1
  },
  sendMessageButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    paddingLeft: 12,
    paddingRight: 12
  },
  sendMessageButtonText: {
    color: '#2CB673'
  }
});

module.exports = MessageView;
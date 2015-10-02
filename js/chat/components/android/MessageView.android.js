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

var _ = require('underscore');
var constants = require('./../../../constants');
var ChatStore = require('./../../ChatStore');

var MessageView = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    activeThread: React.PropTypes.object
  },

  getInitialState() {
    var messages = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      messages: messages.cloneWithRows(ChatStore.getMessages(this.props.activeThread._id)),
      messageInput: ''
    };
  },

  componentDidMount() {

  },

  componentWillUnmount() {

  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      messages: messages.cloneWithRows(ChatStore.getMessage(nextProps.activeThread._id))
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
          placeholder='Chat'
          placeholderTextColor='#AAA'
          underlineColorAndroid='#AAA'
        />
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#888', false) }
          onPress={() => {}}
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
        <View style={ styles.bodyContainer }>
          <ListView
            dataSource={ this.state.messages }
            style={ styles.messageList }
            renderRow={(message) => {
              return (
                <MessageItem
                  key={ 'message:' + message._id }
                  message={ message }
                />
              );
            }}
          />
          { this._renderInput() }
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  bodyContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginTop: 48
  },
  messageList: {
    flex: 1
  },
  inputContainer: {
    position: 'absolute',
    left: 0,
    bottom: 24,
    height: 48,
    width: constants.width,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  messageInput: {
    flex: 1
  },
  sendMessageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12
  },
  sendMessageButtonText: {
    color: '#2CB673'
  }
});

module.exports = MessageView;
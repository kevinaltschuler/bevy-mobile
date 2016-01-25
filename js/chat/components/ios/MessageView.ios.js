/**
 * MessageView.ios.js
 * @author albert
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ListView,
  TextInput,
  RefreshControl,
  Image,
  TouchableHighlight,
  DeviceEventEmitter,
  TouchableOpacity
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var Spinner = require('react-native-spinkit');
var MessageItem = require('./MessageItem.ios.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var ChatStore = require('./../../../chat/ChatStore');
var ChatActions = require('./../../../chat/ChatActions');
var CHAT = constants.CHAT;

var MessageView = React.createClass({
  propTypes: {
    chatRoute: React.PropTypes.object,
    chatNavigator: React.PropTypes.object,
    mainNavigator: React.PropTypes.object,
    allThreads: React.PropTypes.array,
    activeThread: React.PropTypes.object,
    user: React.PropTypes.object
  },

  getInitialState() {
    var messages = ChatStore.getMessages(this.props.activeThread._id);
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.messageValue = '';

    return {
      isRefreshing: false,
      keyboardSpace: 48,
      messageValue: '',
      messages: messages,
      ds: ds.cloneWithRows(messages),
      scrollY: 0
    };
  },

  componentDidMount() {
    ChatStore.on(CHAT.MESSAGES_FETCHED, this._onChatChange);
    DeviceEventEmitter.addListener('keyboardDidShow', this.onKeyboardShow);
    DeviceEventEmitter.addListener('keyboardWillHide', this.onKeyboardHide);

    setTimeout(() => {
      //this.onRefresh();
      this.scrollToBottom();
    }, 1000);
  },

  componentWillUnmount() {
    ChatStore.off(CHAT.MESSAGES_FETCHED, this._onChatChange);
  },

  componentWillReceiveProps(nextProps) {
    var messages = ChatStore.getMessages(nextProps.activeThread._id);
    this.setState({
      isRefreshing: false,
      messages: messages,
      ds: this.state.ds.cloneWithRows(messages)
    });
    //setTimeout(this.onRefresh, 250);
    if(!_.isEmpty(nextProps.initialThread)) {
      //ChatActions.switchThread(nextProps.initialThread._id);
      this.props.clearInitialThread();
    }
  },

  onKeyboardShow(frames) {
    if(frames.end) {
      this.setState({ keyboardSpace: frames.end.height });
    } else {
      this.setState({ keyboardSpace: frames.endCoordinates.height });
    }
  },
  onKeyboardHide(frames) {
    this.setState({ keyboardSpace: 48 });
  },

  _onChatChange() {
    var messages = ChatStore.getMessages(this.props.activeThread._id);
    if(this.state.messages.length != messages.length) {
      // new messages have been added
      //setTimeout(this.scrollToBottom, 300);
    }
    this.setState({
      isRefreshing: false,
      messages: messages,
      ds: this.state.ds.cloneWithRows(messages)
    });
  },

  handleScroll(e) {
    var scrollY = e.nativeEvent.contentInset.top + e.nativeEvent.contentOffset.y;
    if(this.scrollY == null) {
      this.scrollY = scrollY
      return;
    }
    if((this.scrollY - scrollY) > 3) {
      //console.log('blurring');
      //this.refs.MessageInput.blur();
    }
    if((this.scrollY - scrollY) < -5 && this.scrollY > 0) {
      //console.log('focusing');
      //this.refs.MessageInput.focus();
    }
    this.scrollY = scrollY;
  },

  onRefresh() {
    this.setState({ isRefreshing: true });
    ChatActions.fetchMore(this.props.activeThread._id);
  },

  onChange(text) {
    this.messageValue = text;
  },

  onSubmitEditing() {
    var text = this.messageValue;
    var user = this.props.user;

    this.messageValue = '';
    this.MessageInput.clear();

    // dont send an empty message
    if(text == '') {
      return;
    }
    ChatActions.postMessage(this.props.activeThread._id, user, text);

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
      ds: this.state.ds.cloneWithRows(messages)
    });
    setTimeout(this.scrollToBottom, 300);
  },

  onBlur() {
    setTimeout(this.scrollToBottom, 300);
  },
  onFocus() {
    setTimeout(this.scrollToBottom, 300);
  },

  scrollToBottom() {
    var scrollProperties = this.MessageList.scrollProperties;
    var contentLength = scrollProperties.contentLength;
    var visibleLength = scrollProperties.visibleLength;

    if(contentLength <= visibleLength) {
      return;
    }

    var scrollOffset = contentLength - visibleLength;
    scrollOffset += 15;
    requestAnimationFrame(() => {
      this.MessageList.scrollResponderScrollTo(0, scrollOffset);
    });
  },

  goBack() {
    this.props.chatNavigator.pop();
  },

  goToSettings() {
    this.props.chatNavigator.push(routes.CHAT.THREADSETTINGS);
  },

  _renderInfoButton() {
    if(this.props.activeThread.type == 'board') return <View />;
    return (
      <TouchableOpacity
        activeOpacity={ 0.5 }
        style={ styles.iconButton }
        onPress={ this.goToSettings }
      >
        <Icon
          name='info'
          size={ 30 }
          color='#FFF'
        />
      </TouchableOpacity>
    );
  },

  renderHeader() {
    return <View style={{ height: 20 }}/>;
  },

  renderMessageRow(message, sectionID, rowID, highlightRow) {
    var onMount = _.noop;
    rowID = parseInt(rowID);

    if(rowID == this.state.messages.length - 1) {
      onMount = function() {
        setTimeout(this.scrollToBottom, 100);
      }.bind(this);
    }

    return (
      <MessageItem
        key={ 'message:' + message._id }
        message={ message }
        user={ this.props.user }
        mainNavigator={ this.props.mainNavigator }
        onMount={ onMount }
      />
    )
  },

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.topBarContainer }>
          <View style={{
            height: constants.getStatusBarHeight(),
            backgroundColor: '#2CB673'
          }}/>
          <View style={ styles.topBar }>
            <TouchableOpacity
              activeOpacity={ 0.5 }
              style={ styles.iconButton }
              onPress={ this.goBack }
            >
              <Icon
                name='arrow-back'
                size={ 30 }
                color='#FFF'
              />
            </TouchableOpacity>
            <Text style={ styles.title }>
              { ChatStore.getThreadName(this.props.activeThread._id) }
            </Text>
            { this._renderInfoButton() }
          </View>
        </View>
        <ListView
          ref={ ref => { this.MessageList = ref; }}
          style={ styles.messageList }
          contentContainerStyle={ styles.messageListInner }
          dataSource={ this.state.ds }
          onScroll={ this.handleScroll }
          scrollRenderAheadDistance={ 500 }
          showsVerticalScrollIndicator={ true }
          renderRow={ this.renderMessageRow }
          renderHeader={ this.renderHeader }
          refreshControl={
            <RefreshControl
              refreshing={ this.state.isRefreshing }
              onRefresh={ this.onRefresh }
              tintColor='#AAA'
              title='Loading More Messages...'
            />
          }
        />
        <View style={[styles.inputContainer, {
          marginBottom: this.state.keyboardSpace - 48
        }]}>
          <TextInput
            ref={ ref => { this.MessageInput = ref; }}
            style={ styles.messageInput }
            onSubmitEditing={ this.onSubmitEditing }
            blurOnSubmit={ false }
            onFocus={ this.onFocus }
            onBlur={ this.onBlur }
            onChangeText={this.onChange}
            clearButtonMode={ 'while-editing' }
            placeholder='Chat'
            placeholderTextColor='#AAA'
            returnKeyType='send'
          />
          <TouchableOpacity
            activeOpacity={.5}
            onPress={ this.onSubmitEditing }
            style={ styles.sendButton }
          >
            <Icon
              name='send'
              size={ 30 }
              color='#2CB673'
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: '#EEE',
    paddingBottom: 48
  },
  topBarContainer: {
    flexDirection: 'column',
    paddingTop: 0,
    overflow: 'visible',
    backgroundColor: '#2CB673'
  },
  topBar: {
    height: 48,
    backgroundColor: '#2CB673',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 17,
    textAlign: 'center',
    color: '#FFF'
  },
  iconButton: {
    width: 48,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  messageList: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#eee',
  },
  messageListInner: {
    paddingBottom: 15
  },
  loading: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputContainer: {
    height: 48,
    width: constants.width,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 8,
    borderTopColor: '#EEE',
    borderTopWidth: 1
  },
  messageInput: {
    flex: 1,
    paddingLeft: 10
  },
  sendButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    paddingLeft: 12,
    paddingRight: 12,
    paddingVertical: 12
  }
})

module.exports = MessageView;

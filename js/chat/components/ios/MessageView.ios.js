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
var KeyboardEvents = require('react-native-keyboardevents');
var KeyboardEventEmitter = KeyboardEvents.Emitter;
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

    return {
      isRefreshing: false,
      keyboardSpace: 48,
      messageValue: '',
      messages: messages,
      ds: ds.cloneWithRows(messages),
      scrollY: 0,
      end: false
    };
  },

  componentDidMount() {
    ChatStore.on(CHAT.CHANGE_ONE + this.props.activeThread._id, this._onChatChange);
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillShowEvent, this.keyboardWillShow);
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillHideEvent, this.keyboardWillHide);

    ChatActions.fetchMore(this.props.activeThread._id);
  },

  componentWillUnmount() {
    ChatStore.off(CHAT.CHANGE_ONE + this.props.activeThread._id, this._onChatChange);
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardWillShowEvent, this.keyboardWillShow);
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardWillHideEvent, this.keyboardWillHide);
  },

  keyboardWillShow(frames) {
    if(frames.end) {
      this.setState({ keyboardSpace: frames.end.height });
    } else {
      this.setState({ keyboardSpace: frames.endCoordinates.height });
    }
  },
  keyboardWillHide(frames) {
    this.setState({ keyboardSpace: 48 });
  },

  _onChatChange() {
    var messages = ChatStore.getMessages(this.props.activeThread._id);
    this.setState({
      isRefreshing: false,
      messages: messages,
      ds: this.state.ds.cloneWithRows(messages)
    });
  },
  onRefresh() {
    this.setState({
      isRefreshing: true
    });
  },

  handleScroll(e) {
    var scrollY = e.nativeEvent.contentInset.top + e.nativeEvent.contentOffset.y;
    //console.log(scrollY);
    if(this.state.scrollY == null) {
      this.setState({ scrollY: scrollY });
      return;
    }
    if((this.state.scrollY - scrollY) > 3 && this.state.scrollY < -5) {
      //console.log('blurring');
      this.refs.MessageInput.blur();
    }
    if((this.state.scrollY - scrollY) < -5 && this.state.scrollY > 0) {
      //console.log('focusing');
      this.refs.MessageInput.focus();
    }
    this.setState({ scrollY: scrollY });
  },

  handleResponderGrant() {
    this.isTouching = true;
  },
  handleResponderRelease() {
    this.isTouching = false;
  },

  onRefresh() {
    this.setState({
      isRefreshing: true
    });
    ChatActions.fetchMore(this.props.activeThread._id);
  },

  onChange(text) {
    this.setState({ messageValue: text });
  },

  onSubmitEditing() {
    var text = this.state.messageValue;
    var user = this.props.user;
    // dont send an empty message
    if(text == '') {
      return;
    }
    ChatActions.postMessage(this.props.activeThread._id, user, text);
    //reset the field
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
    this.clearAndRetainFocus();
  },

  onEndReached() {
    this.setState({
      end: true
    })
  },

  goBack() {
    this.props.chatNavigator.pop();
  },

  goToSettings() {
    this.props.chatNavigator.push(routes.CHAT.THREADSETTINGS);
  },

  clearAndRetainFocus() {
    this.setState({ messageValue: '' });
    setTimeout(function() {
      this.setState({ messageValue: this.getInitialState().messageValue });
      this.refs.MessageInput.focus();
    }.bind(this), 50);
  },

  scrollToBottom() {
    var scrollProperties = this.MessageList.scrollProperties;
    var scrollOffset = scrollProperties.contentLength - scrollProperties.visibleLength;
    requestAnimationFrame(() => {
      //this.MessageList.getScrollResponder().scrollTo(scrollOffset);
    });
  },

  renderHeader() {
    return <View style={{ height: 20 }}/>;
  },

  renderMessageRow(message, sectionID, rowID, highlightRow) {
    var hidePic = false;
    var showName = true;
    rowID = parseInt(rowID);
    if(rowID < (this.state.ds._dataBlob.s1.length - 1)) {
      hidePic = true;
      if(this.state.ds._dataBlob.s1[rowID + 1].author._id
      != message.author._id) {
        hidePic = false;
      }
    }
    if(rowID > 0) {
      if(this.state.ds._dataBlob.s1[rowID - 1].author._id
      == message.author._id) {
        showName = false;
      }
    }
    return (
      <MessageItem
        key={ 'message:' + message._id }
        message={ message }
        user={ this.props.user }
        hidePic={ hidePic }
        showName={ showName }
        mainNavigator={ this.props.mainNavigator }
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
          </View>
        </View>
        <ListView
          ref={ ref => { this.MessageList = ref; }}
          style={ styles.messageList }
          dataSource={ this.state.ds }
          onScroll={ this.handleScroll }
          onResponderGrant={ this.handleResponderGrant }
          onResponderRelease={ this.handleResponderRelease }
          decelerationRate={ 0.9 }
          scrollRenderAheadDistance={ 500 }
          showsVerticalScrollIndicator={ true }
          onEndReached={ this.onEndReached }
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
            ref='MessageInput'
            value={ this.state.messageValue }
            style={ styles.messageInput }
            onChangeText={ text => { this.onChange(text) }}
            onSubmitEditing={ ev => { this.onSubmitEditing() }}
            onFocus={ this.scrollToBottom }
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
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingRight: 10,
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
  },
  loadMoreButton: {
    backgroundColor: 'rgba(0,0,0,.3)',
    borderRadius: 2,
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10
  },
  loadMoreButtonText: {
    color: '#fff',
    fontSize: 17
  }
})

module.exports = MessageView;

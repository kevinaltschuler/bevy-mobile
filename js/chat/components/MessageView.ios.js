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
  createElement,
  TouchableHighlight,
  TouchableOpacity
} = React;
var Spinner = require('react-native-spinkit');
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
      keyboardSpace: 48,
      messageValue: '',
      messages: messages,
      dataSource: ds.cloneWithRows(messages),
      scrollY: 0,
      end: false
    };
  },
  
  componentWillReceiveProps(nextProps: Object) {
    if(this.props.activeThread._id != nextProps.activeThread._id) {
      // switched threads
      console.log('switched threads');
      var messages = ChatStore.getMessages(nextProps.activeThread._id);
      this.setState({
        messages: messages,
        dataSource: this.state.dataSource.cloneWithRows(messages),
        messageValue: '' // reset text field as well
      });
    }
  },

  componentDidMount: function() {
    ChatStore.on(CHAT.CHANGE_ONE + this.props.activeThread._id, this._onChatChange);

    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillShowEvent, (frames) => {
      if (frames.end) {
        this.setState({keyboardSpace: frames.end.height});
      } else {
        this.setState({keyboardSpace: frames.endCoordinates.height});
      }
    });
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillHideEvent, (frames) => {
      this.setState({
        keyboardSpace: 48
      });
    });
  },

  componentWillUnmount: function() {
    ChatStore.off(CHAT.CHANGE_ONE + this.props.activeThread._id, this._onChatChange);
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardWillShowEvent, (frames) => {

      if (frames.end) {
        this.setState({keyboardSpace: frames.end.height});
      } else {
        this.setState({keyboardSpace: frames.endCoordinates.height});
      }
    });
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardWillHideEvent, (frames) => {
      this.setState({
        keyboardSpace: 48
      });
    });
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
    if(this.state.scrollY == null) {
      this.setState({
        scrollY: scrollY
      });
      return;
    }
    if(this.isTouching) {
      if(scrollY < -60) {
        if(!this.state.isRefreshing) {
          this.setState({
            isRefreshing: true
          });
          this.onRefresh();
        }
      }
    }
    if((this.state.scrollY - scrollY) > 3 && this.state.scrollY < -5) {
      //console.log('blurring');
      //this.refs.MessageInput.blur();
    }
    if((this.state.scrollY - scrollY) < -5 && this.state.scrollY > 0) {
      //console.log('focusing');
      this.refs.MessageInput.focus();
    }
    this.setState({
      scrollY: scrollY
    })
  },

  handleResponderGrant: function() {
    this.isTouching = true;
  },

  handleResponderRelease: function() {
    this.isTouching = false;
  },

  onRefresh: function() {
    this.setState({
      isRefreshing: true
    });
    ChatActions.fetchMore(this.props.activeThread._id);
  },

  onChange: function(text) {
    this.setState({
      messageValue: text
    });
  },

  onSubmitEditing: function() {
    var text = this.state.messageValue;
    console.log(text);
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
    this.clearAndRetainFocus();
  },

  onEndReached() {
    this.setState({
      end: true
    })
  },

  renderHeader: function() {
    if(_.isEmpty(this.state.messages)) return <View />;
    if(!this.state.isRefreshing) {
      return (
        <TouchableOpacity
          activeOpacity={.5}
          style={{
            backgroundColor: 'rgba(0,0,0,.1)', 
            borderRadius: 2, 
            paddingHorizontal: 10, 
            paddingVertical: 5, 
            justifyContent: 'center', 
            alignItems: 'center', 
            marginVertical: 10
          }}
          onPress={() => {
            this.onRefresh();
          }}
        >
          <Text style={{
            color: '#fff', 
            fontWeight: 'bold'
          }}>
            Load More
          </Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={ styles.loading }>
          <Spinner 
            isVisible={ true } 
            size={ 40 } 
            type={ 'Arc' } 
            color={ '#2cb673' }
          />
        </View>
      );
    }
  },

  clearAndRetainFocus: function() {
    this.setState({ 
      messageValue: '' 
    });
    setTimeout(function() {
      this.setState({ 
        messageValue: this.getInitialState().messageValue
      });
      this.refs.MessageInput.focus();
    }.bind(this), 0);
  },

  render: function () {
    return (
      <View 
        style={styles.container} 
        onStartShouldSetResponder={() => {
          this.refs.MessageInput.blur();
          this.setState({
            keyboardSpace: 0
          });
        }}
      >
        <ListView
          ref='messageList'
          style={ styles.scrollContainer }
          onScroll={ this.handleScroll }
          onResponderGrant={ this.handleResponderGrant }
          onResponderRelease={ this.handleResponderRelease }
          decelerationRate={ 0.9 }
          scrollRenderAheadDistance={500}
          dataSource={ this.state.dataSource }
          showsVerticalScrollIndicator={true}
          onEndReached={ this.onEndReached }
          renderRow={ (message, sectionID, rowID, highlightRow) => {
            var hidePic = false;
            if(rowID > 0) {
              if(this.state.dataSource._dataBlob.s1[rowID - 1].author._id 
                == message.author._id) {
                var hidePic = true;
              }
            }
            return (
              <MessageItem 
                key={ message._id } 
                message={ message } 
                user={ this.props.user } 
                hidePic={ hidePic }
              />
            )
          }}
          renderHeader={ this.renderHeader }
          renderFooter={() => { 
            return <View style={{ height: 20 }}/>;
          }}
        />
        <View style={[styles.inputContainer, {
          marginBottom: this.state.keyboardSpace - 48
        }]}>
          <TextInput
            ref='MessageInput'
            value={ this.state.messageValue }
            style={ styles.messageInput }
            onChangeText={(text) => { this.onChange(text); }}
            onSubmitEditing={(ev) => { this.onSubmitEditing(); }}
            clearButtonMode={ 'while-editing' }
            placeholder='Chat'
            placeholderTextColor='#AAA'
            returnKeyType={ 'send' }
          />
          <TouchableOpacity
            activeOpacity={.5}
            onPress={ this.onSubmitEditing }
          >
            <Text style={ styles.sendMessageButton }>
              Send
            </Text>
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
    justifyContent: 'flex-end'
  },
  scrollContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingRight: 10,
  },
  textInput: {
    height: 40,
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingLeft: 16,
    backgroundColor: '#fff',
    color: '#000',
    marginBottom: 0
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
  sendMessageButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    paddingLeft: 12,
    paddingRight: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2cb673'
  }
})

module.exports = MessageView;

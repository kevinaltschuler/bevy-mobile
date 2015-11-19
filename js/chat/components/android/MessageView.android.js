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
  BackAndroid,
  ProgressBarAndroid,
  StyleSheet
} = React;
var MessageItem = require('./MessageItem.android.js');
var InvertibleScrollView = require('react-native-invertible-scroll-view');
var Icon = require('react-native-vector-icons/MaterialIcons');
var MessageInput = require('./MessageInput.android.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
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

  getDefaultProps() {
    return {
      activeThread: {}
    };
  },

  getInitialState() {
    var messages = ChatStore.getMessages(this.props.activeThread._id);
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      messages: messages,
      dataSource: ds.cloneWithRows(messages),
      loading: false
    };
  },

  componentDidMount() {
    ChatStore.on(CHAT.CHANGE_ONE + this.props.activeThread._id, this._onChatChange);
    BackAndroid.addEventListener('hardwareBackPress', this.onBackButton);
  },
  componentWillUnmount() {
    ChatStore.off(CHAT.CHANGE_ONE + this.props.activeThread._id, this._onChatChange);
    BackAndroid.removeEventListener('hardwareBackPress', this.onBackButton);
  },

  componentWillReceiveProps(nextProps) {
    var messages = ChatStore.getMessages(nextProps.activeThread._id)
    this.setState({
      messages: messages,
      dataSource: this.state.dataSource.cloneWithRows(messages)
    });
  },

  goBack() {
    this.props.mainNavigator.pop();
  },

  goToInfoView() {
    this.props.mainNavigator.push(routes.MAIN.THREADSETTINGS);
  },

  onBackButton() {
    this.props.mainNavigator.pop();
    return true;
  },

  loadMessages() {
    this.setState({
      loading: true
    });
    ChatActions.fetchMore(this.props.activeThread._id);
  },

  _onChatChange() {
    var messages = ChatStore.getMessages(this.props.activeThread._id);
    this.setState({
      messages: messages,
      dataSource: this.state.dataSource.cloneWithRows(messages),
      loading: false
    });
  },

  onSubmitEditing(text) {
    if(_.isEmpty(text)) return;

    var user = this.props.user;
    ChatActions.postMessage(this.props.activeThread._id, user, text);

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

  _renderInfoButton() {
    if(this.props.activeThread.type == 'bevy') return <View />; 
    return (
      <TouchableNativeFeedback
        background={ TouchableNativeFeedback.Ripple('#62D487', false) }
        onPress={ this.goToInfoView }
      >
        <View style={ styles.infoButton }>
          <Icon
            name='info-outline'
            size={ 30 }
            color='#FFF'
          />
        </View>
      </TouchableNativeFeedback>
    );
  },

  _renderListHeader() {
    // disable load more if theres no more messages
    if(_.isEmpty(this.state.messages)) return <View />;
    if(!this.state.loading) {
      return (
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#DDD', false) }
          onPress={ this.loadMessages }
        >
          <View style={ styles.loadMoreButton }>
            <Text style={ styles.loadMoreButtonText }>
              Load More Messages
            </Text>
          </View>
        </TouchableNativeFeedback>
      );
    } else {
      return (
        <View style={ styles.loading }>
          <ProgressBarAndroid styleAttr='Small' />
          <Text style={ styles.loadingText }>
            Loading...
          </Text>
        </View>
      );
    }
  },

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.topBar }>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#62D487', false) }
            onPress={ this.goBack }
          >
            <View style={ styles.backButton }>
              <Icon
                name='arrow-back'
                size={ 30 }
                color='#FFF'
              />
            </View>
          </TouchableNativeFeedback>
          <View style={ styles.title }>
            <Text style={ styles.titleText }>
              { ChatStore.getThreadName(this.props.activeThread._id) }
            </Text>
          </View>
          { this._renderInfoButton() }
        </View>
        <ListView
          renderScrollComponent={
            (props) => <InvertibleScrollView {...props} { ...this.state } />
          }
          contentContainerStyle={{
            paddingBottom: 20
          }}
          dataSource={ this.state.dataSource }
          style={ styles.messageList }
          scrollRenderAheadDistance={ 300 }
          removeClippedSubviews={ true }
          initialListSize={ 10 }
          pageSize={ 10 }
          renderHeader={ this._renderListHeader }
          renderRow={(message) => {
            return (
              <MessageItem
                key={ 'message:' + message._id }
                message={ message }
                user={ this.props.user }
                mainNavigator={ this.props.mainNavigator }
              />
            );
          }}
        />
        <MessageInput
          onSubmitEditing={ this.onSubmitEditing }
        />
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
  topBar: {
    width: constants.width,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#2CB673'
  },
  backButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    marginRight: 10
  },
  infoButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10
  },
  title: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleText: {
    flex: 1,
    color: '#FFF',
    fontSize: 18,
    flexWrap: 'wrap'
  },
  loadMoreButton: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    borderRadius: 3,
    marginBottom: 10
  },
  loadMoreButtonText: {
    flex: 1,
    textAlign: 'center'
  },
  loading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginBottom: 10
  },
  loadingText: {
    color: '#AAA',
    marginLeft: 10
  },
  messageList: {
    flexDirection: 'column',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 20
  }
});

module.exports = MessageView;
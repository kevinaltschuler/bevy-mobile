/**
 * ThreadView.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  ListView,
  ScrollView,
  TouchableNativeFeedback,
  TouchableHighlight,
  Text,
  ToastAndroid,
  PullToRefreshViewAndroid,
  StyleSheet
} = React;
var ThreadItem = require('./ThreadItem.android.js');
var Icon = require('./../../../shared/components/android/Icon.android.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var ChatStore = require('./../../../chat/ChatStore');
var ChatActions = require('./../../../chat/ChatActions');
var CHAT = constants.CHAT;

var ThreadView = React.createClass({
  propTypes: {
    allThreads: React.PropTypes.array,
    activeThread: React.PropTypes.object,
    chatNavigator: React.PropTypes.object,
    mainNavigator: React.PropTypes.object,
    loggedIn: React.PropTypes.bool
  },

  getInitialState() {
    var threads = this.props.allThreads;
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      ds: ds.cloneWithRows(threads),
      threads: threads,
      floatingActionOpen: false,
      loading: false
    };
  },

  componentDidMount() {
    ChatStore.on(CHAT.FETCHING_THREADS, this.onFetchingThreads);
    ChatStore.on(CHAT.THREADS_FETCHED, this.onThreadsFetched);
  },
  componentWillUnmount() {
    ChatStore.off(CHAT.FETCHING_THREADS, this.onFetchingThreads);
    ChatStore.off(CHAT.THREADS_FETCHED, this.onThreadsFetched);
  },

  componentWillReceiveProps(nextProps) {
    var threads = nextProps.allThreads;
    this.setState({
      ds: this.state.ds.cloneWithRows(threads),
      threads: threads
    });
  },

  onFetchingThreads() {
    this.setState({
      loading: true
    });
  },
  onThreadsFetched() {
    this.setState({
      loading: false
    });
  },

  onRefresh() {
    ChatActions.fetchThreads();
  },

  openNewThreadView() {
    if(!this.props.loggedIn) {
      ToastAndroid.show('Please Log In To Chat', ToastAndroid.SHORT);
      return;
    }
    this.props.mainNavigator.push(routes.MAIN.NEWTHREAD);
  },

  _renderNoThreadsText() {
    if(_.isEmpty(this.props.allThreads)) {
      var hintText = (this.props.loggedIn)
        ? 'No Conversations'
        : 'Please Log In to Chat';
      return (
        <View style={ styles.noThreadsContainer }>
          <Text style={ styles.noThreads }>{ hintText }</Text>
        </View>
      );
    } else return (
      <View />
    );
  },

  _renderThreadItem(thread) {
    var active = false;
    if(thread._id == this.props.activeThread._id) active = true;
    return (
      <ThreadItem
        key={ thread._id }
        thread={ thread }
        user={ this.props.user }
        active={ active }
        chatNavigator={ this.props.chatNavigator }
        chatRoute={ this.props.chatRoute }
        mainNavigator={ this.props.mainNavigator }
      />
    );
  },

  _renderActionBar() {
    return (
      <TouchableHighlight
        onPress={ this.openNewThreadView }
        underlayColor='#62D487'
        style={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          backgroundColor: '#2CB673',
          width: 48,
          height: 48,
          borderRadius: 24,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 8
        }}
      >
        <View>
          <Icon
            name='add'
            size={ 40 }
            color='#FFF'
          />
        </View>
      </TouchableHighlight>
    );
  },

  render() {
    return (
      <View style={ styles.container }>
        { this._renderNoThreadsText() }
        <PullToRefreshViewAndroid
          style={{
            flex: 1
          }}
          refreshing={ this.state.loading }
          onRefresh={ this.onRefresh }
        >
          <ListView
            style={ styles.threadList }
            dataSource={ this.state.ds }
            renderRow={ this._renderThreadItem }
            scrollRenderAheadDistance={ 300 }
            removeClippedSubviews={ true }
            initialListSize={ 10 }
            pageSize={ 10 }
          />
        </PullToRefreshViewAndroid>
        { this._renderActionBar() }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    borderTopColor: '#EEE',
    borderTopWidth: 1
  },
  threadList: {
    flex: 1
  },
  panelHeader: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  panelHeaderText: {
    color: '#AAA'
  },
  noThreadsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  noThreads: {
    color: '#AAA',
    fontSize: 22,
    textAlign: 'center'
  }
});

module.exports = ThreadView;

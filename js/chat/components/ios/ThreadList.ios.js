/**
 * ThreadList.ios.js
 * @author albert
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  ListView,
  Text,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  SegmentedControlIOS
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var ThreadItem = require('./ThreadItem.ios.js');
var Spinner = require('react-native-spinkit');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var ChatStore = require('./../../../chat/ChatStore');
var ChatActions = require('./../../../chat/ChatActions');
var CHAT = constants.CHAT;

var ThreadList = React.createClass({
  propTypes: {
    allThreads: React.PropTypes.array,
    activeThread: React.PropTypes.object,
    chatNavigator: React.PropTypes.object,
    mainNavigator: React.PropTypes.object
  },

  getInitialState() {
    return {
      threads: [],
      ds: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        .cloneWithRows([]),
      tab: 'Board Chats',
      loading: true,
      allThreads: ChatStore.getAll()
    };
  },

  componentWillReceiveProps(nextProps) {
    /*var threads = nextProps.allThreads;
    threads = this.pruneEmptyThreads(threads);
    if(this.state.tab == 'Board Chats') {
      threads = _.filter(threads, function(thread) {return !_.isEmpty(thread.board)});
    }
    else {
      threads = _.filter(threads, function(thread) {return _.isEmpty(thread.board)});
    }
    this.setState({
      threads: threads,
      ds: this.state.ds.cloneWithRows(threads),
      loading: false
    })*/
  },

  componentDidMount() {
    ChatStore.on(CHAT.FETCHING_THREADS, this.onLoading);
    ChatStore.on(CHAT.THREADS_FETCHED, this.onLoaded);
    ChatStore.on(CHAT.CHANGE_ALL, this.onLoaded);
    this.onRefresh();
  },
  componentWillUnmount() {
    ChatStore.off(CHAT.FETCHING_THREADS, this.onLoading);
    ChatStore.off(CHAT.THREADS_FETCHED, this.onLoaded);
    ChatStore.off(CHAT.CHANGE_ALL, this.onLoaded);
  },

  onLoading() {
    this.setState({
      //ds: this.state.ds.cloneWithRows([]),
      loading: true
    });
  },
  onLoaded() {
    var threads = ChatStore.getAll();
    threads = this.pruneEmptyThreads(threads);
    var allThreads = threads;
    if(this.state.tab == 'Board Chats') {
      threads = _.filter(threads, function(thread) {return !_.isEmpty(thread.board)});
    }
    else {
      threads = _.filter(threads, function(thread) {return _.isEmpty(thread.board)});
    }
    this.setState({
      loading: false,
      threads: threads,
      ds: this.state.ds.cloneWithRows(threads),
      allThreads: allThreads
    });
  },
  onRefresh() {
    ChatActions.fetchThreads();
  },

  changeTab(tab) {
    var threads = this.pruneEmptyThreads(this.state.allThreads);
    if(tab == 'Board Chats') {
      threads = _.filter(threads, function(thread) {return !_.isEmpty(thread.board)});
    }
    else {
      threads = _.filter(threads, function(thread) {return _.isEmpty(thread.board)});
    }
    this.setState({
      tab: tab,
      ds: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        .cloneWithRows(threads),
      threads: threads
    })
  },

  pruneEmptyThreads(threads) {
    return _.reject(threads, thread => {
      return _.isEmpty(ChatStore.getThreadName(thread._id));
    });
  },

  goToNewThread() {
    this.props.mainNavigator.push(routes.MAIN.NEWTHREAD);
  },

  renderThreadRow(thread) {
    return (
      <ThreadItem
        key={ 'threadItem:' + thread._id }
        thread={ thread }
        user={ this.props.user }
        chatNavigator={ this.props.chatNavigator }
        chatRoute={ this.props.chatRoute }
        mainNavigator={this.props.mainNavigator}
      />
    );
  },

  renderThreadSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View
        key={ 'separator:' + rowID }
        style={{
        width: constants.width,
        height: 1,
        flexDirection: 'row',
        alignItems: 'center'
      }}>
        <View style={{
          width: 90,
          height: 1,
          backgroundColor: '#FFF'
        }}/>
        <View style={{
          flex: 1,
          height: 1,
          backgroundColor: '#EEE'
        }}/>
      </View>
    );
  },

  _renderNoThreads() {
    if(_.isEmpty(this.state.threads)) {
      return (
        <View style={ styles.noThreadsContainer }>
          <Text style={ styles.noThreadsText }>
            No Chats Yet
          </Text>
        </View>
      );
    }
  },

  _renderLoading() {
    if(this.state.loading) {
      return (
        <View style={ styles.spinnerContainer }>
          <Spinner
            isVisible={ true }
            size={ 60 }
            type={ '9CubeGrid' }
            color={ '#2cb673' }
          />
        </View>
      );
    } else return <View />;
  },

  _renderThreads() {
    //if(this.state.loading) return <View />;
    return (
      <ListView
        ref={ ref => { this.ThreadList = ref; }}
        style={ styles.threadList }
        dataSource={ this.state.ds }
        decelerationRate={ 0.9 }
        automaticallyAdjustContentInsets={ false }
        refreshControl={
          <RefreshControl
            refreshing={ this.state.loading }
            onRefresh={ this.onRefresh }
            tintColor='#AAA'
            title='Loading...'
          />
        }
        renderRow={ this.renderThreadRow }
        renderSeparator={ this.renderThreadSeparator }
      />
    )
  },

  render() {
    var tabIndex = (this.state.tab == 'Board Chats') ? 0 : 1;
    return (
      <View style={ styles.container }>
        <View style={ styles.topBarContainer }>
          <View style={{
            height: constants.getStatusBarHeight(),
            backgroundColor: '#2CB673'
          }}/>
          <View style={ styles.topBar }>
            <View style={{
              width: 48,
              height: 48
            }}/>
            <Text style={ styles.title }>
              Chat
            </Text>
            <TouchableOpacity
              activeOpacity={ 0.5 }
              style={ styles.newThreadButton }
              onPress={ this.goToNewThread }
            >
              <Icon
                name='create'
                size={ 30 }
                color='#FFF'
              />
            </TouchableOpacity>
          </View>
          <View style={ styles.tabs }>
            <SegmentedControlIOS
              style={ styles.segmentedControl }
              tintColor='#fff'
              values={['Board Chats', 'User Chats']}
              selectedIndex={ tabIndex }
              onValueChange={ ev => { this.changeTab(ev) }}
            />
          </View>
        </View>
        { this._renderNoThreads() }
        {/* this._renderLoading() */}
        { this._renderThreads() }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#EEE'
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
  newThreadButton: {
    width: 48,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  threadList: {
    marginBottom: 48
  },
  noThreadsContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  noThreadsText: {
    fontSize: 22,
    color: '#aaa'
  },
  spinnerContainer: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#eee',
    paddingTop: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: constants.height - 300
  },
  tabs: {
    flexDirection: 'row',
    height: 48,
    backgroundColor: '#2cb673'
  },
  segmentedControl: {
    backgroundColor: '#2cb673',
    marginTop: 10,
    marginHorizontal: 10,
    flex: 1
  },
  tab: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

module.exports = ThreadList;

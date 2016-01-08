/**
 * ThreadItem.ios.js
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
  ScrollView
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var ThreadItem = require('./ThreadItem.ios.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var ChatStore = require('./../../../chat/ChatStore');
var StatusBarSizeIOS = require('react-native-status-bar-size');

var ThreadList = React.createClass({
  propTypes: {
    allThreads: React.PropTypes.array,
    activeThread: React.PropTypes.object,
    chatNavigator: React.PropTypes.object,
    mainNavigator: React.PropTypes.object
  },

  getInitialState() {
    var threads = this.props.allThreads;
    threads = this.pruneEmptyThreads(threads);
    return {
      threads: threads,
      ds: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        .cloneWithRows(threads)
    };
  },

  componentWillReceiveProps(nextProps) {
    var threads = nextProps.allThreads;
    threads = this.pruneEmptyThreads(threads);
    this.setState({
      threads: threads,
      ds: this.state.ds.cloneWithRows(threads)
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

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.topBarContainer }>
          <View style={{
            height: StatusBarSizeIOS.currentHeight,
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
            <TouchableHighlight
              underlayColor='rgba(0,0,0,0.1)'
              style={ styles.newThreadButton }
              onPress={ this.goToNewThread }
            >
              <Icon
                name='create'
                size={ 30 }
                color='#FFF'
              />
            </TouchableHighlight>
          </View>
        </View>

        <ListView
          ref={(ref) => { this.ThreadList = ref; }}
          style={ styles.threadList }
          dataSource={ this.state.ds }
          decelerationRate={ 0.9 }
          automaticallyAdjustContentInsets={ false }
          renderRow={ this.renderThreadRow }
          renderSeparator={ this.renderThreadSeparator }
        />

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
  }
});

module.exports = ThreadList;

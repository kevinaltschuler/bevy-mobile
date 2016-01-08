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
    chatNavigator: React.PropTypes.object
  },

  getInitialState() {
    return {
      threads: this.props.allThreads
    };
  },

  componentWillReceiveProps(nextProps) {
    console.log('rerender');
    this.setState({
      threads: nextProps.allThreads
    })
  },

  goToNewThread() {
    this.props.chatNavigator.push(routes.CHAT.NEWTHREAD);
  },

  _renderThreads() {
    var threadItems = [];
    for(var key in this.state.threads) {
      var thread = this.state.threads[key];
      var active = false;
      if(thread._id == this.props.activeThread._id) active = true;
      if(_.isEmpty(ChatStore.getThreadName(thread._id)))
        continue;
      threadItems.push(
        <ThreadItem
          thread={ thread }
          user={ this.props.user }
          key={ 'threadItem:' + thread._id }
          active={ active }
          chatNavigator={ this.props.chatNavigator }
        />
      );
    }
    return threadItems;
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
        <ScrollView
          dataSource={ this.state.threads }
          style={ styles.list }
          automaticallyAdjustContentInsets={ false }
        >
          { this._renderThreads() }
        </ScrollView>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
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
  list: {
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

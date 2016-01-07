/*
 * ThreadItem.ios.js
 * @author albert kevin
 */

'use strict';

var React = require('react-native');
var {
  View,
  ListView,
  Text,
  StyleSheet,
  ScrollView
} = React;
var Icon = require('react-native-vector-icons/Ionicons');
var ThreadItem = require('./ThreadItem.ios.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var ChatStore = require('./../../../chat/ChatStore');

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

  _renderThreads() {

    var threadItems = [];

    for(var key in this.state.threads) {

      //console.log('thread');

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
        <ScrollView
          dataSource={ this.state.threads }
          style={ styles.list }
          automaticallyAdjustContentInsets={false}
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
    flexDirection: 'row'
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

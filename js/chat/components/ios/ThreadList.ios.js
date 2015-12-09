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
  StyleSheet
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
    var threadData = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      threads: threadData.cloneWithRows(this.props.allThreads)
    };
  },

  componentWillReceiveProps(nextProps) {
    console.log('rerender');
    this.setState({
      threads: this.state.threads.cloneWithRows(nextProps.allThreads)
    });
  },

  render() {
    if(!this.props.loggedIn) {
      return (
        <View style={ styles.container }>
          <View style={ styles.noThreadsContainer }>
            <Text style={ styles.noThreadsText }>
              Please log in
            </Text>
          </View>
        </View>
      );
    }
    return (
      <View style={ styles.container }>
        <ListView
          dataSource={ this.state.threads }
          style={ styles.list }
          renderHeader={() => (<View style={{marginTop: -20}}/>)}
          renderFooter={() => (<View style={{marginBottom: 48}}/>)}
          renderRow={(thread) => {

            var active = false;
            if(thread._id == this.props.activeThread._id) active = true;

            if(_.isEmpty(ChatStore.getThreadName(thread._id)))
              return <View/>;

            return (
              <ThreadItem
                thread={ thread }
                user={ this.props.user }
                active={ active }
                chatNavigator={ this.props.chatNavigator }
              />
            );
          }}
        />
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

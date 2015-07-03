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
  Image
} = React;

var ChatStore = require('./../ChatStore');

var MessageItem = require('./MessageItem.ios.js');

var InChatView = React.createClass({

  propTypes: {
    chatRoute: React.PropTypes.object,
    chatNavigator: React.PropTypes.object,
    allThreads: React.PropTypes.array
  },

  getInitialState: function() {

    var activeThread = _.findWhere(this.props.allThreads, { 
      _id: this.props.chatRoute.activeThread 
    });
    var messages = ChatStore.getMessages(activeThread._id);
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    return {
      activeThread: activeThread,
      messages: messages,
      dataSource: ds.cloneWithRows(messages)
    };
  },

  render: function () {

    var allThreads = this.props.allThreads;

    var messages = [];
    this.state.messages.forEach(function(message) {
      messages.push(
        <MessageItem key={ message._id } message={ message } />
      );
    });

    return (
      <View style={styles.container} >
        <ListView
          style={ styles.scrollContainer }
          dataSource={ this.state.dataSource }
          renderRow={ (message) => (
            <MessageItem key={ message._id } message={ message } />
          )}
        />
        <TextInput
          style={styles.textInput}
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'flex-start',
  },
  scrollContainer: {
    flex: 1,
    flexDirection: 'column',
    height: 515,
    backgroundColor: '#eee',
    paddingLeft: 10,
    paddingRight: 10,
  },
  textInput: {
    height: 40,
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingLeft: 16,
    backgroundColor: '#fff',
    color: 'black'
  },
})

module.exports = InChatView;

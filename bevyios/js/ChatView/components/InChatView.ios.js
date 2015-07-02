/**
 * InChatView.js
 * kevin made this 
 * dank nanr shake 
 */
'use strict';

var React = require('react-native');
var _ = require('underscore');
var {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Text,
  View,
  NavigatorIOS,
  SegmentedControlIOS,
  ScrollView,
  TextInput,
  Image
} = React;

var ChatStore = require('./../ChatStore');

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

    return {
      activeThread: activeThread,
      messages: ChatStore.getMessages(activeThread._id)
    };
  },

  render: function () {

    var allThreads = this.props.allThreads;

    var messages = [];
    this.state.messages.forEach(function(message) {
      messages.push(
        <Text key={ message._id }>{ message.body }</Text>
      );
    });

    return (
      <View style={styles.container} >
        <ScrollView style={styles.scrollContainer}>
          { messages }
        </ScrollView>
        <TextInput
          style={styles.textInput}
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingLeft: 8,
    paddingRight: 8,
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 50
  },
  scrollContainer: {
    height: 100,
    backgroundColor: 'rgba(0,0,0,.3)'
  },
  textInput: {
    height: 40,
    width: 360,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingLeft: 16,
    backgroundColor: 'rgba(0,0,0,0.1)',
    color: 'black'
  },
})

module.exports = InChatView;

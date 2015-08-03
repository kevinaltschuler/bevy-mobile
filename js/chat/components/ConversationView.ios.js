/**
 * ChatView.js
 * kevin made this 
 * SMASH 4 SUCKS 
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  ScrollView
} = React;

var ThreadItem = require('./ThreadItem.ios.js');

var ConversationView = React.createClass({

  propTypes: {
    chatRoute: React.PropTypes.object,
    chatNavigator: React.PropTypes.object,
    allThreads: React.PropTypes.array,
    user: React.PropTypes.object
  },

  render: function () {

    var threads = [];
    var allThreads = this.props.allThreads || [];
    allThreads.forEach(function(thread) {
      threads.push(
        <ThreadItem key={ thread._id } thread={ thread } chatRoute={ this.props.chatRoute } chatNavigator={ this.props.chatNavigator } user={ this.props.user }/>
      );
    }.bind(this));

    return (
      <View style={styles.container} >
        <ScrollView style={styles.scrollContainer}>
          { threads }
        </ScrollView>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd',
    flexDirection: 'column',
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    flexDirection: 'column'
  }
})

module.exports = ConversationView;

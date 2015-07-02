/**
 * ChatView.js
 * kevin made this 
 * SMASH 4 SUCKS 
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  SegmentedControlIOS,
  ScrollView,
  Image
} = React;

var ThreadItem = require('./ThreadItem.ios.js');

var ConversationView = React.createClass({

  propTypes: {
    route: React.PropTypes.object,
    navigator: React.PropTypes.object,
    allThreads: React.PropTypes.array
  },

  render: function () {

    var threads = [];
    var allThreads = this.props.allThreads || [];
    allThreads.forEach(function(thread) {
      threads.push(
        <ThreadItem key={ thread._id } thread={ thread } route={ this.props.route } navigator={ this.props.navigator }/>
      );
    }.bind(this));

    return (
      <View style={styles.container} >
        <SegmentedControlIOS
          values={ ['Conversations', 'Contacts'] }
          selectedIndex={ 0 }
          tintColor='#2CB673'
          style={styles.segControl}
        />
        <ScrollView style={styles.scrollContainer}>
          { threads }
        </ScrollView>
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
  },
  segControl: {
    backgroundColor: 'white'
  },
  scrollContainer: {
    //paddingTop: 30
  }
})

module.exports = ConversationView;

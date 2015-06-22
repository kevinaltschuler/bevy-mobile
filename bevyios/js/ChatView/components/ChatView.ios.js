/**
 * ChatView.js
 * kevin made this 
 * SMASH 4 SUCKS 
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Text,
  View,
  NavigatorIOS,
  SegmentedControlIOS,
  ScrollView
} = React;

var ChatItem = require('./ChatItem.ios.js');

var ChatView = React.createClass({

  render: function () {

    return (
      <View style={styles.container} >
        <SegmentedControlIOS
          values={['Chats', 'Contacts']}
          tintColor='#2CB673'
          style={styles.segControl}
        />
        <ScrollView style={styles.scrollContainer}>
          <ChatItem/>
          <ChatItem/>
          <ChatItem/>
          <ChatItem/>
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

  }
})

module.exports = ChatView;

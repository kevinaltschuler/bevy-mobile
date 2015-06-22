/**
 * ChatItem.js
 * kevin made this 
 * max is a weiner
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
  Image,
  TouchableHighlight
} = React;

var ChatItem = React.createClass({

  render: function () {

    return (
      <TouchableHighlight
        underlayColor='rgba(0,0,0,.1)'
      >
        <View style={styles.container} >
            <View style={styles.titleRow}>
              <Image style={styles.titleImage}/>
              <View style={styles.titleTextColumn}>
                <Text style={styles.titleText}>
                  Conversation Name
                </Text>
                <Text style={styles.subTitleText}>
                  Last Poster: Last Message
                </Text>
              </View>
            </View>
        </View>
      </TouchableHighlight>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    marginLeft: 5,
    paddingTop: 15,
    paddingBottom: 15,
    marginRight: 8,
    flexDirection: 'column',
    borderColor: '#ccc',
  },
  titleRow: {
    flexDirection: 'row'
  },
  titleImage: {
    width: 40,
    height: 40,
    backgroundColor: 'black',
    borderRadius: 20,
  },
  titleTextColumn: {
    flexDirection: 'column',
    justifyContent: 'center',
    height: 40,
    marginLeft: 10
  },
  titleText: {
    color: '#282929'
  },
  subTitleText: {
    fontSize: 10,
    color: '#282929'
  },
})

module.exports = ChatItem;

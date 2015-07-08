/**
 * NotificationItem.js
 * kevin made this 
 * I heard albert eats deer poop
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
  TouchableHighlight,
  TouchableOpacity
} = React;

var Icon = require('FAKIconImage');

var NotificationItem = React.createClass({

  render: function () {

    return (
      <View style={ styles.notificationCard }>
        <TouchableHighlight
          underlayColor='rgba(0,0,0,.1)'
          style={styles.left} 
        >
          <View style={styles.row}>
            <Image style={styles.titleImage}/>
            <View style={styles.rightRow}>
  	          <View style={styles.titleTextColumn}>
  	            <Text style={styles.titleText}>
  	              post to bevyName by User
  	            </Text>
  	            <Text style={styles.subTitleText}>
  	              Details
  	            </Text>
  	          </View>
  	        </View>
          </View>
        </TouchableHighlight>

        <TouchableHighlight 
          underlayColor='rgba(0,0,0,.1)'
          style={styles.right}
        >
          <View style={styles.textWrapper}>
            <Text>
              Join
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
});

var styles = StyleSheet.create({
   notificationCard: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    height: 58
  },
  row: {
    flexDirection: 'row'
  },
  titleImage: {
    width: 40,
    height: 40,
    backgroundColor: 'black',
    borderRadius: 20,
  },
  rightRow: {
  	flex: 1,
  	flexDirection: 'row',
  	justifyContent: 'space-between'
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
  left: {
    padding: 10,
    flex: 3
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  textWrapper: {
    width: 30,
  }
})

module.exports = NotificationItem;

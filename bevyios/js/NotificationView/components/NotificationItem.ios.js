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
      <TouchableHighlight
        underlayColor='rgba(0,0,0,.1)'
        style={styles.notificationCard} 
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
	          <TouchableOpacity 
	            activeOpacity={.8}
	            style={styles.actionTouchable}
	          >
	            <Icon
	              name='ion|ios-close-empty'
	              size={30}
	              color='#757d83'
	              style={styles.dismissIcon}
	            />
	          </TouchableOpacity>
	      </View>
        </View>
      </TouchableHighlight>
    );
  }
});

var styles = StyleSheet.create({
   notificationCard: {
		flex: 1,
		flexDirection: 'column',
	    marginLeft: 10,
	    marginRight: 10,
	    marginBottom: 8,
	    padding: 10,
		backgroundColor: 'white',
		borderRadius: 2,
		shadowColor: 'black',
		shadowRadius: 1,
		shadowOpacity: .3,
		shadowOffset:  {width: 0, height: 0}
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
  dismissIcon: {
  	width: 20,
  	height: 20
  }
})

module.exports = NotificationItem;

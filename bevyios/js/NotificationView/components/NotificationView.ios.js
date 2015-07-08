/**
 * NotificationView.js
 * kevin made this 
 * albert sucks eggs 
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Text,
  View,
  ListView
} = React;

var NotificationItem = require('./NotificationItem.ios.js');
var constants = require('./../../constants.js');

var NotificationView = React.createClass({

  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var user = constants.getUser();
    var bevyArray = [];

    bevyArray = [  
    {
    "_id": "557612ea4708964217f97c11",
    "user": "555a6e227c19724d38321651",
    "event": "post:create",
    "data": {
      "author_name": "debbie bluntz",
      "author_img": "http://api.joinbevy.com/files/EJXu5SOS.jpg",
      "bevy_name": "bevy team",
      "post_title": "https://www.youtube.com/watch?v=KCCqRaqbqxA"
    },
    "__v": 0,
    "id": "557612ea4708964217f97c11"
    },
    {}];

    return {
      dataSource: ds.cloneWithRows(bevyArray),
    };
  },


  render: function () {

    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) => <NotificationItem />}
      />
    );
  }
});

var styles = StyleSheet.create({
  container: {
  }
})

module.exports = NotificationView;

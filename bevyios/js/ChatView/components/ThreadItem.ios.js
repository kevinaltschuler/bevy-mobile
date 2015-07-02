/**
 * ChatItem.js
 * kevin made this 
 * max is a weiner
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
  Image,
  TouchableHighlight
} = React;

var InChatView = require('./InChatView.ios.js');

var constants = require('./../../constants');
var user = constants.getUser();

var ThreadItem = React.createClass({

  propTypes: {
    route: React.PropTypes.object,
    navigator: React.PropTypes.object,
    thread: React.PropTypes.object
  },

  goToInChat: function() {
    /*this.props.toRoute({
      name: "InConversation",
      component: InChatView
    })*/
  },

  render: function () {

    var thread = this.props.thread;
    console.log(thread);

    var threadName = 'Default Thread Name';
    var threadImage = constants.siteurl + '/img/logo_100.png';
    if(thread.bevy) {
      threadName = thread.bevy.name;
      threadImage = thread.bevy.image_url || constants.siteurl + '/img/logo_100.png';
    } else if( thread.members.length > 1 ) {
      var otherUser = _.find(thread.members, function(member) {
        return member.user._id != user._id;
      });
      threadName = otherUser.user.displayName;
      threadImage = otherUser.user.image_url || constants.siteurl + '/img/user-profile-icon.png';
    }

    return (
      <TouchableHighlight
        underlayColor='rgba(0,0,0,.1)'
        onPress={this.goToInChat}
      >
        <View style={styles.container} >
            <View style={styles.titleRow}>
              <Image 
                source={{ uri: threadImage }}
                style={styles.titleImage}
              />
              <View style={styles.titleTextColumn}>
                <Text style={styles.titleText}>
                  { threadName }
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
    backgroundColor: 'white',
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

module.exports = ThreadItem;

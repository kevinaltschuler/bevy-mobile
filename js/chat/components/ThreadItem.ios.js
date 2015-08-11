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

var constants = require('./../../constants');
var routes = require('./../../routes');
var ChatActions = require('./../ChatActions');

var ThreadItem = React.createClass({

  propTypes: {
    chatRoute: React.PropTypes.object,
    chatNavigator: React.PropTypes.object,
    thread: React.PropTypes.object,
    user: React.PropTypes.object,
    chatMenuActions: React.PropTypes.object
  },

  getInitialState() {

    var thread = this.props.thread;
    var threadInfo = this.getThreadInfo(thread);
    return {
      threadName: threadInfo.threadName,
      threadImage: threadInfo.threadImage
    };
  },

  componentWillReceiveProps(nextProps) {

    var thread = nextProps.thread;
    var threadInfo = this.getThreadInfo(thread);

    this.setState({
      threadName: threadInfo.threadName,
      threadImage: threadInfo.threadImage
    });
  },

  getThreadInfo(thread) {
    var user = this.props.user;

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

    return {
      threadName: threadName,
      threadImage: threadImage
    };
  },

  render() {

    var thread = this.props.thread;
    //console.log(thread);

    var threadName = this.state.threadName;
    var threadImage = this.state.threadImage;

    return (
      <TouchableHighlight
        underlayColor='rgba(0,0,0,.2)'
        onPress={() => {
          var thread_id = this.props.thread._id;
          ChatActions.switchThread(thread_id);
          this.props.chatMenuActions.closeMenu();
        }}
      >
        <View style={styles.container} >
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
      </TouchableHighlight>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 7,
    paddingRight: 7,
    paddingTop: 5,
    paddingBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleImage: {
    width: 36,
    height: 36,
    backgroundColor: 'white',
    borderRadius: 18,
    marginRight: 7,
  },
  titleTextColumn: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
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

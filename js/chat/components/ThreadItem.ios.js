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
var ChatStore = require('./../ChatStore');

var ThreadItem = React.createClass({

  propTypes: {
    chatRoute: React.PropTypes.object,
    chatNavigator: React.PropTypes.object,
    thread: React.PropTypes.object,
    user: React.PropTypes.object,
    active: React.PropTypes.bool // is this thread being displayed currently
  },

  getDefaultProps() {
    return {
      active: false
    };
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
    } else if( thread.users.length > 1 ) {

    }

    return {
      threadName: threadName,
      threadImage: threadImage
    };
  },

  _renderLatestMessageInfo() {
    var latestMessage = ChatStore.getLatestMessage(this.props.thread._id);
    if(_.isEmpty(latestMessage)) return <View />;

    var posterName = latestMessage.author.displayName;
    if(latestMessage.author._id == this.props.user._id) posterName = 'Me';

    return (
      <Text style={ styles.subTitleText }>
        { latestMessage.author.displayName }: { latestMessage.body }
      </Text>
    );
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
          this.props.chatNavigator.push(routes.CHAT.CHATVIEW);
        }}
      >
        <View style={[ styles.container, {
          backgroundColor: (this.props.active) ? '#eee' : '#fff'
        }]} >
          <Image 
            source={{ uri: threadImage }}
            style={ styles.titleImage }
          />
          <View style={ styles.titleTextColumn }>
            <Text style={ styles.titleText }>
              { threadName }
            </Text>
            { this._renderLatestMessageInfo() }
          </View>
        </View>
      </TouchableHighlight>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
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

/**
 * ThreadItem.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableNativeFeedback
} = React;
var ThreadImage = require('./ThreadImage.android.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var ChatActions = require('./../../ChatActions');
var ChatStore = require('./../../ChatStore');



var ThreadItem = React.createClass({
  propTypes: {
    chatRoute: React.PropTypes.object,
    chatNavigator: React.PropTypes.object,
    mainNavigator: React.PropTypes.object,
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
    var thread = this.props.thread;

    var threadName = ChatStore.getThreadName(thread._id);
    var threadImage = ChatStore.getThreadImageURL(thread._id);
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
    var threadName = this.state.threadName;
    var threadImage = this.state.threadImage;

    if(_.isEmpty(threadName)) return <View />;

    return (
      <TouchableNativeFeedback
        background={ TouchableNativeFeedback.Ripple('#FFF', false) }
        onPress={() => {
          var thread_id = this.props.thread._id;
          ChatActions.switchThread(thread_id);
          this.props.mainNavigator.push(routes.MAIN.MESSAGEVIEW);
        }}
      >
        <View style={[ styles.container, {
          backgroundColor: '#fff'
        }]} >
          <ThreadImage 
            thread={thread}
          />
          <View style={ styles.titleTextColumn }>
            <Text style={ styles.titleText }>
              { threadName }
            </Text>
            { this._renderLatestMessageInfo() }
          </View>
        </View>
      </TouchableNativeFeedback>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 60,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center'
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
  }
})

module.exports = ThreadItem;

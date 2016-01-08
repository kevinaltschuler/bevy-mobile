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
var ThreadImage = require('./ThreadImage.ios.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var ChatActions = require('./../../../chat/ChatActions');
var ChatStore = require('./../../../chat/ChatStore');

var ThreadItem = React.createClass({
  propTypes: {
    chatRoute: React.PropTypes.object,
    chatNavigator: React.PropTypes.object,
    thread: React.PropTypes.object,
    user: React.PropTypes.object
  },

  getInitialState() {
    return {
    };
  },

  goToMessageView() {
    var thread_id = this.props.thread._id;
    ChatActions.switchThread(thread_id);
    this.props.chatNavigator.push(routes.CHAT.MESSAGEVIEW);
  },

  _renderLatestMessageInfo() {
    var latestMessage = this.props.thread.latest;
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
    return (
      <TouchableHighlight
        underlayColor='rgba(0,0,0,.2)'
        onPress={ this.goToMessageView }
      >
        <View style={ styles.container } >
          <ThreadImage
            thread={ this.props.thread }
          />
          <View style={ styles.titleTextColumn }>
            <Text style={ styles.titleText }>
              { ChatStore.getThreadName(this.props.thread._id) }
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
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: '#FFF'
  },
  titleImage: {
    width: 36,
    height: 36,
    backgroundColor: 'white',
    borderRadius: 18,
    marginRight: 8,
  },
  titleTextColumn: {
    flex: 1,
    height: 48,
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

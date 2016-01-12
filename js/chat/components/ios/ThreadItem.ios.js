/**
 * ThreadItem.ios.js
 * kevin made this
 * max is a weiner
 * @author kevin
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity
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

  _renderTimeAgo() {
    var latestMessage = this.props.thread.latest;
    if(_.isEmpty(latestMessage)) return '';

    var createDate = new Date(latestMessage.created);
    var delta = Date.now() - createDate.getTime();
    // if within 2 days
    if(delta <= (1000 * 60 * 60 * 24 * 2)) {
      var ampm = (createDate.getHours() <= 11) ? 'am' : 'pm';
      var hours = (createDate.getHours() > 12)
        ? createDate.getHours() - 12
        : (createDateDate.getHours() < 11)
          ? '0' + (createDate.getHours() + 1)
          : '12';
      var minutes = (createDate.getMinutes() < 10)
        ? '0' + createDate.getMinutes()
        : createDate.getMinutes();
      return hours + ':' + minutes + ' ' + ampm;
    }
    // if within a week
    else if (delta <= (1000 * 60 * 60 * 24 * 7)) {
      var weekdayMap = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return weekdayMap[createDate.getDay()];
    }
    // else, display the date
    else {
      var monthMap = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
        'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return monthMap[createDate.getMonth()] + ' ' + createDate.getDate();
    }
  },

  _renderLatestMessage() {
    var latestMessage = this.props.thread.latest;
    if(_.isEmpty(latestMessage)) return '';

    var posterName = latestMessage.author.displayName;
    if(latestMessage.author._id == this.props.user._id) posterName = 'Me';

    return latestMessage.author.displayName + ': ' + latestMessage.body;
  },

  render() {


    return (
      <TouchableOpacity
        activeOpacity={ 0.5 }
        onPress={ this.goToMessageView }
      >
        <View style={ styles.container } >
          <ThreadImage
            thread={ this.props.thread }
            width={ 60 }
            height={ 60 }
          />
          <View style={ styles.threadDetails }>
            <View style={ styles.top }>
              <Text style={ styles.name }>
                { ChatStore.getThreadName(this.props.thread._id) }
              </Text>
              <Text style={ styles.time }>
                { this._renderTimeAgo() }
              </Text>
            </View>
            <Text style={ styles.message }>
              { this._renderLatestMessage() }
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
    backgroundColor: '#FFF',
    paddingLeft: 15
  },
  titleImage: {
    width: 36,
    height: 36,
    backgroundColor: 'white',
    borderRadius: 18,
    marginRight: 8,
  },
  threadDetails: {
    flex: 1,
    height: 80,
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 15
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  name: {
    flex: 1,
    color: '#282929',
    fontSize: 18,
    marginBottom: 5
  },
  time: {
    color: '#AAA',
    fontSize: 17,
    marginRight: 15
  },
  message: {
    fontSize: 16,
    color: '#AAA'
  },
})

module.exports = ThreadItem;

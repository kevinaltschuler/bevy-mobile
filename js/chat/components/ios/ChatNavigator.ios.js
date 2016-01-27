/**
 * ChatNavigator.ios.js
 * @author albert
 * @author kevin
 * @flow
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Navigator,
  ScrollView,
  Image,
  TouchableHighlight,
  TouchableOpacity
} = React;
var ThreadSettingsView = require('./ThreadSettingsView.ios.js');
var MessageView = require('./MessageView.ios.js');
var ThreadList = require('./ThreadList.ios.js');
var NewThreadView = require('./NewThreadView.ios.js');
var AddPeopleView = require('./AddPeopleView.ios.js');

var _ = require('underscore');
var routes = require('./../../../routes');
var constants = require('./../../../constants');
var ChatStore = require('./../../../chat/ChatStore');
var ChatActions = require('./../../../chat/ChatActions');
var CHAT = constants.CHAT;

var ChatNavigator = React.createClass({
  propTypes: {
    allThreads: React.PropTypes.array,
    activeThread: React.PropTypes.object
  },

  render() {

    return (
      <Navigator
        navigator={ this.props.mainNavigator }
        initialRouteStack={[{
          name: routes.CHAT.THREADLIST
        }]}
        renderScene={(route, navigator) => {
          return (
            <ChatView
              chatNavigator={ navigator }
              chatRoute={ route }
              { ...this.props }
            />
          );
        }}
      />
    );
  }
});

var ChatView = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    mainRoute: React.PropTypes.object,
    chatNavigator: React.PropTypes.object,
    chatRoute: React.PropTypes.object
  },

  componentDidMount() {
    ChatStore.on(CHAT.SWITCH_TO_THREAD, this.onThreadChange);
  },
  componentWillUnmount() {
    ChatStore.off(CHAT.SWITCH_TO_THREAD, this.onThreadChange);
  },

  onThreadChange(thread_id) {
    console.log('thread change', thread_id);
    var route = {
      name: routes.CHAT.MESSAGEVIEW,
      threadID: thread_id
    };
    this.props.chatNavigator.push(route);

    var $routes = this.props.mainNavigator.getCurrentRoutes();
    var currentRoute = $routes[$routes.length - 1];
    console.log('current route:', currentRoute);
    if(currentRoute.name == routes.MAIN.NEWTHREAD) {
      setTimeout(() => {
        this.props.mainNavigator.pop();
      }, 500);
    }
  },

  render() {

    switch(this.props.chatRoute.name) {
      case routes.CHAT.THREADLIST:
        return (
          <ThreadList
            { ...this.props }
          />
        );
        break;
      case routes.CHAT.MESSAGEVIEW:
        return (
          <MessageView
            { ...this.props }
            threadID={ this.props.chatRoute.threadID }
            chatRoute={ this.props.chatRoute }
          />
        );
        break;
      case routes.CHAT.THREADSETTINGS:
        return (
          <ThreadSettingsView
            { ...this.props }
          />
        );
        break;
      case routes.CHAT.ADDPEOPLE:
        return (
          <AddPeopleView
            { ...this.props }
          />
        );
        break;
    }
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee'
  }
});

module.exports = ChatNavigator;

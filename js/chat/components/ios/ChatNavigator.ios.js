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

var ChatNavigator = React.createClass({
  propTypes: {
    allThreads: React.PropTypes.array,
    activeThread: React.PropTypes.object
  },

  render() {
    return (
      <Navigator
        navigator={ this.props.mainNavigator }
        initialRoute={ routes.CHAT.THREADLIST }
        initialRouteStack={[
          routes.CHAT.THREADLIST
        ]}
        renderScene={(route, navigator) => {
          switch(route.name) {
            case routes.CHAT.THREADLIST.name:
              return (
                <ThreadList
                  { ...this.props }
                  chatNavigator={ navigator }
                  chatRoute={ route }
                />
              );
              break;
            case routes.CHAT.MESSAGEVIEW.name:
              return (
                <MessageView
                  { ...this.props }
                  chatNavigator={ navigator }
                  chatRoute={ route }
                />
              );
              break;
            case routes.CHAT.THREADSETTINGS.name:
              return (
                <ThreadSettingsView
                  { ...this.props }
                  chatNavigator={ navigator }
                  chatRoute={ route }
                />
              );
              break;
            case routes.CHAT.NEWTHREAD.name:
              return (
                <NewThreadView
                  { ...this.props }
                  chatNavigator={ navigator }
                  chatRoute={ route }
                />
              );
              break;
            case routes.CHAT.ADDPEOPLE.name:
              return (
                <AddPeopleView
                  { ...this.props }
                  chatNavigator={ navigator }
                  chatRoute={ route }
                />
              );
              break;
            default:
              return (
                <View>
                  <Text>DEFAULT CHAT ROUTE</Text>
                </View>
              );
              break;
          }
        }}
      />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee'
  }
});

module.exports = ChatNavigator;

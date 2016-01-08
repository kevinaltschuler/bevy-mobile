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
var Icon = require('react-native-vector-icons/Ionicons');
var ThreadSettingsView = require('./ThreadSettingsView.ios.js');
var MessageView = require('./MessageView.ios.js');
var ThreadList = require('./ThreadList.ios.js');
var NewThreadView = require('./NewThreadView.ios.js');
var AddPeopleView = require('./AddPeopleView.ios.js');

var _ = require('underscore');
var routes = require('./../../../routes');
var ChatStore = require('./../../ChatStore');

var ChatNavigator = React.createClass({
  propTypes: {
    allThreads: React.PropTypes.array,
    activeThread: React.PropTypes.object
  },

  getInitialState() {
    return {
      navbarText: 'Chat',
    }
  },

  setNavbarText(text) {
    this.setState({
      navbarText: text
    });
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
          var view;
          switch(route.name) {
            case routes.CHAT.THREADLIST.name:
              view = (
                <ThreadList
                  { ...this.props }
                  chatNavigator={ navigator }
                />
              );
              break;
            case routes.CHAT.MESSAGEVIEW.name:
              view = (
                <MessageView
                  { ...this.props }
                  chatNavigator={ navigator }
                />
              );
              break;
            case routes.CHAT.THREADSETTINGS.name:
              view = (
                <ThreadSettingsView
                  { ...this.props }
                  chatNavigator={ navigator }
                />
              );
              break;
            case routes.MAIN.NEWTHREAD.name:
              view = (
                <NewThreadView
                  { ...this.props }
                  chatNavigator={ navigator }
                />
              );
              break;
            case routes.CHAT.ADDPEOPLE.name:
              view = (
                <AddPeopleView
                  { ...this.props }
                  chatNavigator={ navigator }
                  ref={ref => this.addPeopleView = ref}
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
          return (
            <View style={{ flex: 1, backgroundColor: '#eee'}}>
              { view }
            </View>
          );
        }}
      />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
  },
  headerStyle: {
    backgroundColor: '#2CB673',
    flex: 1
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 39,
    backgroundColor: 'rgba(0,0,0,0)',
    marginLeft: 5
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  backButtonIcon: {
    paddingLeft: 5,
    paddingRight: 5,
    width: 30,
    height: 30
  },
  backButtonText: {
    fontSize: 15
  }
});

module.exports = ChatNavigator;

/**
 * PostView.js
 * kevin made this
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
  TouchableHighlight
} = React;

var SideMenu = require('react-native-side-menu');
var ChatView = require('./ChatView.ios.js');
var Navbar = require('./../../shared/components/Navbar.ios.js');
var BackButton = require('./../../shared/components/BackButton.ios.js');
var ThreadList = require('./ThreadList.ios.js');
var ChatStore = require('./../ChatStore');

var _ = require('underscore');
var routes = require('./../../routes');

var ChatNavigator = React.createClass({

  propTypes: {
    allThread: React.PropTypes.array,
    activeThread: React.PropTypes.object
  },

  getInitialState() {
    return {
      navbarText: 'Chat'
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
        initialRoute={ routes.CHAT.LISTVIEW }
        initialRouteStack={[
          routes.CHAT.LISTVIEW
        ]}
        renderScene={(route, navigator) => {
          var view;
          switch(route.name) {
            case routes.CHAT.LISTVIEW.name:
            default:
              view = (
                <ThreadList 
                  { ...this.props }
                  chatNavigator={ navigator }
                />
              );
              break;
            case routes.CHAT.CHATVIEW.name:
              view = (
                <ChatView
                  {...this.props }
                  chatNavigator={ navigator }
                />
              )
              break;
          }

          var navbarText = 'Chat';
          if(!_.isEmpty(this.props.activeThread)) {
            if(!_.isEmpty(this.props.activeThread.bevy)) {
              // bevy chat
              navbarText = this.props.activeThread.bevy.name + "'s Chat";
            } else {
              // PM
              navbarText = ChatStore.getThreadName(this.props.activeThread._id);
            }
          }
          if(route.name == routes.CHAT.LISTVIEW.name) {
            navbarText = 'Chat'
          }

          var backButton = (route.name != routes.CHAT.CHATVIEW.name)
          ? <View />
          : <BackButton onPress={() => {
            navigator.pop();
          }.bind(this)} />;

          return (
            <View style={{ flex: 1, backgroundColor: '#eee'}}>
              <Navbar 
                chatRoute={ route }
                chatNavigator={ navigator }
                left={ backButton }
                center={ navbarText }
                { ...this.props }
              />
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
  }
});

module.exports = ChatNavigator;

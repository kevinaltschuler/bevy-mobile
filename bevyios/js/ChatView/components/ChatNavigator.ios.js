/**
 * PostView.js
 * kevin made this
 */
'use strict';

var React = require('react-native');
var _ = require('underscore');
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

var ConversationView = require('./ConversationView.ios.js');
var InChatView = require('./InChatView.ios.js');
var Navbar = require('./../../shared/components/Navbar.ios.js');
var BackButton = require('./../../shared/components/BackButton.ios.js');

var routes = require('./../../routes');

var ChatNavigator = React.createClass({
  render: function() {
    return (
      <Navigator
        navigator={ this.props.navigator }
        initialRoute={ routes.CHAT.CONVERSATIONVIEW }
        initialRouteStack={ _.toArray(routes.CHAT) }
        renderScene={(route, navigator) => 
          <ChatView
            chatRoute={ route }
            chatNavigator={ navigator }
            { ...this.props }
          />
        }
      />
    );
  }
});

var ChatView = React.createClass({

  propTypes: {
    chatRoute: React.PropTypes.object,
    chatNavigator: React.PropTypes.object
  },

  render: function() {
    var view;
    switch(this.props.chatRoute.name) {
      case 'ConversationView':
        view = (
          <ConversationView 
            { ...this.props }
          />
        );
        break;
      case 'InChatView':
        view = (
          <InChatView
            { ...this.props }
          />
        );
        break;
    }

    var navbarText = 'Chat';
    if(this.props.chatRoute.threadName)
      navbarText = this.props.chatRoute.threadName;

    var backButton = (this.props.chatRoute.name == 'ConversationView')
    ? <View />
    : <BackButton onPress={() => {
      this.props.chatNavigator.jumpTo(routes.CHAT.CONVERSATIONVIEW);
    }} />;

    return (
      <View style={{ flex: 1}}>
        <Navbar 
          chatRoute={ this.props.chatRoute }
          chatNavigator={ this.props.chatNavigator }
          left={ backButton }
          center={ navbarText }
          view={ view }
          { ...this.props }
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64
  },
  headerStyle: {
    backgroundColor: '#2CB673',
    flex: 1
  }
});

module.exports = ChatNavigator;

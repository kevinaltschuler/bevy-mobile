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
        navigator={ this.props.mainNavigator }
        initialRoute={ routes.CHAT.CONVERSATIONVIEW }
        initialRouteStack={[
          routes.CHAT.CONVERSATIONVIEW
        ]}
        renderScene={(route, navigator) => {
          var view;
          switch(route.name) {
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
          if(route.threadName)
            navbarText = route.threadName;

          var backButton = (route.name == 'ConversationView')
          ? <View />
          : <BackButton onPress={() => {
            navigator.jumpTo(routes.CHAT.CONVERSATIONVIEW);
          }} />;

          return (
            <View style={{ flex: 1}}>
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
    paddingTop: 64
  },
  headerStyle: {
    backgroundColor: '#2CB673',
    flex: 1
  }
});

module.exports = ChatNavigator;

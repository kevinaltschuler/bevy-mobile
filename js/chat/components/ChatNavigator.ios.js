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

var _ = require('underscore');
var routes = require('./../../routes');

var ChatNavigator = React.createClass({

  propTypes: {
    allThread: React.PropTypes.array,
    activeThread: React.PropTypes.object
  },

  render() {
    return (
      <Navigator
        navigator={ this.props.mainNavigator }
        initialRoute={ routes.CHAT.CHATVIEW }
        initialRouteStack={[
          routes.CHAT.CHATVIEW
        ]}
        renderScene={(route, navigator) => {
          var view;
          switch(route.name) {
            case routes.CHAT.CHATVIEW.name:
            default:
              view = (
                <ChatView 
                  { ...this.props }
                />
              );
              break;
          }

          var navbarText = 'Chat';
          if(!_.isEmpty(this.props.activeThread)) {
            if(!_.isEmpty(this.props.activeThread.bevy)) {
              // bevy chat
              navbarText = this.props.activeThread.bevy.name + "'s Chat";
            } else {
              // PM
            }
          }

          var backButton = (route.name == routes.CHAT.CHATVIEW.name)
          ? <View />
          : <BackButton onPress={() => {
            navigator.jumpTo(routes.CHAT.CHATVIEW);
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

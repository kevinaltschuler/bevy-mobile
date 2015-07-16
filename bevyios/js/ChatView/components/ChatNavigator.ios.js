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

var routes = require('./../../routes');

var Navbar = React.createClass({

  propTypes: {
    chatRoute: React.PropTypes.object,
    chatNavigator: React.PropTypes.object
  },

  goBack: function() {
    this.props.chatNavigator.jumpTo(routes.CHAT.CONVERSATIONVIEW);
  },

  render: function() {

    var backButton = <Text />;
    if(this.props.chatRoute.name != 'ConversationView')
      backButton = (
        <TouchableHighlight
          underlayColor='rgba(0,0,0,.1)'
          onPress={this.goBack} 
          style={ styles.backButtonContainer } >
          <Image source={require('image!back_button')} style={styles.backButton} />
        </TouchableHighlight>
      );

    var navbarText = 'Chat';
    if(this.props.chatRoute.threadName)
      navbarText = this.props.chatRoute.threadName;

    return (
      <View style={ styles.navbar }>
        <View style={ styles.left }>
          { backButton }
        </View>
        <View style={ styles.center }>
          <Text style={ styles.navbarText }>{ navbarText }</Text>
        </View>
        <View style={ styles.right }>
        </View>
      </View>
    );
  }
});

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

    return (
      <View style={{ flex: 1}}>
        <Navbar 
          chatRoute={ this.props.chatRoute }
          chatNavigator={ this.props.chatNavigator }
        />
        { view }
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
  },
  navbar: {
    backgroundColor: '#2CB673',
    flexDirection: 'row',
    height: 64,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  backButtonContainer: {
  },
  backButton: {
    width: 12,
    height: 19,
  },
  navbarText: {
    flex: 1,
    color: '#fff',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '500'
  },
  left: {
    height: 32,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  center: {
    height: 32,
    flex: 2,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  right: {
    flex: 1,
    height: 64
  }
});

module.exports = ChatNavigator;

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
var BevyList= require('./../../BevyList/components/BevyList.ios.js');
var Router = require('react-native-router');

var ConversationView = require('./ConversationView.ios.js');
var InChatView = require('./InChatView.ios.js');

var Navbar = React.createClass({

  propTypes: {
    chatRoute: React.PropTypes.object,
    chatNavigator: React.PropTypes.object
  },

  goBack: function() {
    this.props.chatNavigator.push({
      name: 'ConversationView',
      index: 0
    });
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
        { backButton }
        <Text style={ styles.navbarText }>{ navbarText }</Text>
      </View>
    );
  }
});

var ChatNavigator = React.createClass({
  render: function() {
    return (
      <Navigator
        initialRoute={{ name: 'ConversationView', index: 0 }}
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
      <View>
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
    paddingTop: 64,
    width: 500
  },
  headerStyle: {
    backgroundColor: '#2CB673',
    flex: 1
  },
  navbar: {
    backgroundColor: '#2CB673',
    flex: 1,
    flexDirection: 'row',
    height: 64,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backButtonContainer: {
    alignSelf: 'flex-start'
  },
  backButton: {
    width: 10,
    height: 17,
    marginLeft: 10,
    marginTop: 20,
    marginRight: 10,
    paddingTop: 20
  },
  navbarText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '500'
  }
});

module.exports = ChatNavigator;

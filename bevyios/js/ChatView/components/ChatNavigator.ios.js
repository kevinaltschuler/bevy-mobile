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
    paddingTop: 64,
    width: 500
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
    color: '#fff',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '500'
  },
  left: {
    height: 32,
    width: 32,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  center: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  right: {
    height: 64,
    width: 32,
  }
});

module.exports = ChatNavigator;

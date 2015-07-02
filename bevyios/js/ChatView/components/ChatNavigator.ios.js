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
  Image
} = React;

var SideMenu = require('react-native-side-menu');
var BevyList= require('./../../BevyList/components/BevyList.ios.js');
var Router = require('react-native-router');

var ConversationView = require('./ConversationView.ios.js');
var InChatView = require('./InChatView.ios.js');

var LeftButton = React.createClass({
  render: function () {
    return (
      <Image source={require('image!back_button')} style={styles.backButton} />
    );
  }
});

var Navbar = React.createClass({

  render: function() {
    return (
      <View style={ styles.navbar }>
        <Text style={ styles.navbarText }>Chat</Text>
      </View>
    );
  }
});

var ChatNavigator = React.createClass({

  render: function () {
      
    /*var firstRoute = {
      name: 'Chat',
      component: ChatView
    }*/

    //var bevyList = <BevyList />

    /*return (
        <Router
          backButtonComponent={LeftButton}
          headerStyle={styles.headerStyle}
          firstRoute = {firstRoute}
          navigator={this.props.navigator}
        />
    );*/
    return (
      <Navigator
        initialRoute={{ name: 'ChatView', index: 0 }}
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
      case 'ChatView':
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
        <Navbar />
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
  backButton: {
    width: 10,
    height: 17,
    marginLeft: 10,
    marginTop: 3,
    marginRight: 10
  },
  navbar: {
    backgroundColor: '#2CB673',
    flex: 1,
    height: 64,
    justifyContent: 'flex-end',
    paddingBottom: 13
  },
  navbarText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '500'
  }
});

module.exports = ChatNavigator;

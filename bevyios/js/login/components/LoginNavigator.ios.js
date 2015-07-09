/**
 * BevyBar.js
 * kevin made this
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Navigator
} = React;

var LoginView = require('./LoginView.ios.js');
var RegisterView = require('./RegisterView.ios.js');
var ForgotView = require('./ForgotView.ios.js');

var BackButton = require('./../../shared/components/BackButton.ios.js');

var Navbar = React.createClass({
  propTypes: {
    loginRoute: React.PropTypes.object,
    loginNavigator: React.PropTypes.object
  },

  goBack: function() {
    this.props.loginNavigator.push({
      name: 'LoginView',
      index: 0
    });
  },

  render: function() {

    var backButton = (this.props.loginRoute.name == 'LoginView')
    ? (<View />)
    : (
      <BackButton
        onPress={ this.goBack }
      />
    );

    return (
      <View style={ styles.navbar }>
        <View style={ styles.left }>
          { backButton }
        </View>
        <View style={ styles.center }>
          <Text style={ styles.navbarText }></Text>
        </View>
        <View style={ styles.right }>
        </View>
      </View>
    );
  }
});

var MainView = React.createClass({
  propTypes: {
    loginRoute: React.PropTypes.object,
    loginNavigator: React.PropTypes.object
  },

  render: function() {
    var view;
    switch(this.props.loginRoute.name) {
      case 'RegisterView':
        view = (
          <RegisterView
            { ...this.props }
          />
        );
        break;
      case 'ForgotView':
        view = (
          <ForgotView
            { ...this.props }
          />
        );
        break;
      case 'LoginView':
      default:
        view = (
          <LoginView
            { ...this.props }
          />
        ); 
        break;
    }

    return (
      <View style={{ flex: 1 }}>
        <Navbar
          loginRoute={ this.props.loginRoute }
          loginNavigator={ this.props.loginNavigator }
        />
        { view }
      </View>
    );
  }
});

var LoginNavigator = React.createClass({
  render: function () {
    return (
      <Navigator
        navigator={ this.props.navigator }
        initialRoute={{ name: 'LoginView', index: 0 }}
        renderScene={(route, navigator) => 
          <MainView
            loginRoute={ route }
            loginNavigator={ navigator }
            { ...this.props }
          />
        }
      />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
    padding: 0,
  },
  navbar: {
    backgroundColor: '#2CB673',
    flexDirection: 'row',
    height: 64,
    justifyContent: 'space-between',
    alignItems: 'center'
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

module.exports = LoginNavigator;

/**
 * LoginNavigator.ios.js
 * not using native navigator because of height/layout issues
 * so no fancy animations here
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

var constants = require('./../../constants');
var routes = require('./../../routes');

var LoginNavigator = React.createClass({

  propTypes: {
    authModalActions: React.PropTypes.object
  },

  getInitialState() {
    return {
      currentRoute: 'login'
    };
  },

  changeRoute(route) {
    this.setState({
      currentRoute: route
    });
  },

  render: function () {

    var navigator = {
      change: this.changeRoute
    };

    switch(this.state.currentRoute) {
      case 'register':
        return <RegisterView 
          { ...this.props } 
          loginNavigator={ navigator } 
          authModalActions={ this.props.authModalActions }
        />;
        break;
      case 'forgot':
        return <ForgotView 
          { ...this.props } 
          loginNavigator={ navigator }
          authModalActions={ this.props.authModalActions }
        />;
        break;
      case 'login':
      default:
        return <LoginView 
          { ...this.props } 
          loginNavigator={ navigator }
          authModalActions={ this.props.authModalActions }
        />;
        break;
    }
  }
});


module.exports = LoginNavigator;

/**
 * LoginNavigator.ios.js
 * not using native navigator because of height/layout issues
 * so no fancy animations here
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableHighlight
} = React;
var LoginView = require('./LoginView.ios.js');
var RegisterView = require('./RegisterView.ios.js');
var ForgotView = require('./ForgotView.ios.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');

var LoginNavigator = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    close: React.PropTypes.func
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

    var title = 'log in';

    switch(this.state.currentRoute) {
      case 'register':
        title = 'register';
        return (
          <RegisterView
            { ...this.props }
            close={ this.props.close }
            loginNavigator={ navigator }
          />
        );
        break;
      case 'forgot':
        title = 'forgot my password';
        return (
          <ForgotView
            { ...this.props }
            close={this.props.close}
            loginNavigator={ navigator }
          />
        );
        break;
      case 'login':
      default:
        title = 'login';
        return (
          <LoginView
            { ...this.props }
            close={ this.props.close }
            loginNavigator={ navigator }
          />
        );
        break;
    }
  }
});

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: constants.width,
    height: constants.height,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  panel: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 20,
  },
  topBar: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 10,
    flex: 1,
  },
  closeButton: {
    height: 48,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start'
  },
  closeButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  closeButtonText: {
    fontSize: 17,
    color: '#fff'
  },
  panelHeaderText: {
    fontSize: 20,
    color: '#666',
    flex: 2,
    marginLeft: 20
  },
});


module.exports = LoginNavigator;

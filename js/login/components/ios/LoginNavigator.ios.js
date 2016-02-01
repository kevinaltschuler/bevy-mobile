/**
 * LoginNavigator.ios.js
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
    };
  },

  render() {
    var sceneConfig = Navigator.SceneConfigs.FloatFromBottom;
    // disable gestures
    sceneConfig.gestures = null;

    return (
      <Navigator
        navigator={ this.props.mainNavigator }
        configureScene={() => sceneConfig }
        initialRouteStack={[{
          name: routes.LOGIN.LOGIN
        }]}
        renderScene={(route, navigator) => {
          switch(route.name) {
            case routes.LOGIN.LOGIN:
              let LoginView = require('./LoginView.ios.js');
              return (
                <LoginView
                  { ...this.props }
                  loginNavigator={ navigator }
                  loginRoute={ route }
                />
              );
              break;

            case routes.LOGIN.REGISTER:
              let RegisterView = require('./RegisterView.ios.js');
              return (
                <RegisterView
                  { ...this.props }
                  loginNavigator={ navigator }
                  loginRoute={ route }
                />
              );
              break;

            case routes.LOGIN.FORGOT:
              let ForgotView = require('./ForgotView.ios.js');
              return (
                <ForgotView
                  { ...this.props }
                  loginNavigator={ navigator }
                  loginRoute={ route }
                />
              );
              break;
          }
        }}
      />
    );
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

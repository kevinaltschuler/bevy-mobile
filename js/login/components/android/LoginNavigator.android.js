/**
 * LoginNavigator.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Navigator,
  StyleSheet
} = React;
var LoginBar = require('./LoginBar.android.js');
var LoginView = require('./LoginView.android.js');
var RegisterView = require('./RegisterView.android.js');
var ForgotView = require('./ForgotView.android.js');

var routes = require('./../../../routes');
var constants = require('./../../../constants');

var LoginNavigator = React.createClass({
  propTypes: {
    mainRoute: React.PropTypes.object,
    mainNavigator: React.PropTypes.object
  },

  render() {
    return (
      <Navigator
        navigator={ this.props.navigator }
        navigationBar={ <LoginBar { ...this.props } /> }
        initialRouteStack={[
          routes.LOGIN.LOGIN
        ]}
        sceneStyle={{
          flex: 1,
          marginTop: 48
        }}
        renderScene={(route, navigator) => {
          switch(route.name) {
            case routes.LOGIN.LOGIN.name:
              return <LoginView loginRoute={ route } loginNavigator={ navigator } { ...this.props } />;
              break;
            case routes.LOGIN.REGISTER.name:
              return <RegisterView loginRoute={ route } loginNavigator={ navigator } { ...this.props } />;
              break;
            case routes.LOGIN.FORGOT.name:
              return <ForgotView loginRoute={ route } loginNavigator={ navigator } { ...this.props } />;
              break;
            default:
              return <Text>Default Login Route</Text>;
              break;
          }
        }}
      />
    );
  }
});

var styles = StyleSheet.create({

});

module.exports = LoginNavigator;
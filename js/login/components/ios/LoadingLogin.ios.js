/**
 * LoggingIn.ios.js
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  Image,
  View,
  AsyncStorage
} = React;

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var Spinner = require('react-native-spinkit');

var LoadingLogin = React.createClass({

  render() {
    var logoUrl = constants.siteurl + '/img/logo_300_white.png';
    return (
      <View style={{
        height: constants.height,
        width: constants.width,
        backgroundColor: '#2cb673',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Spinner
          isVisible={ true }
          size={ 60 }
          type={ '9CubeGrid' }
          color={ '#fff' }
        />
      </View>
    );
  }
});

module.exports = LoadingLogin;

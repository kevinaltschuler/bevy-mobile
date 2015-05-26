/**
 * BevyBar.js
 * kevin made this
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Text,
  View,
  NavigatorIOS,
} = React;

var TabBar = require('./TabBar.ios.js);

var firstRoute = {
  name: 'Welcome!',
  component: HelloPage
};

var BevyBar = React.createClass({

  render: function () {
      return (
        <NavigatorIOS
        initialRoute={{
        component: MyView,
        title: 'My View Title',
        passProps: { myProp: 'foo' },
      }}
    />
      );
    }
});

module.exports = BevyBar;

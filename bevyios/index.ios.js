/**
 * the bevy ios app
 * made by kevin for the SUB-OHM ARMY 
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Text,
  View,
  Navigator
} = React;

var MainView = require('./js/MainView.ios.js');

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 0,
  },
});

var bevyios = React.createClass({

  render: function() {
    return (
        <Navigator
          initialRoute={{name: 'LoginNavigator', index: 0}}
          renderScene={(route, navigator) => 
            <MainView 
              route={route}
              navigator={navigator}
            />
          }
        />
    );
  }
});

AppRegistry.registerComponent('bevyios', () => bevyios);

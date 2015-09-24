/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator
} = React;
var MainView = require('./js/app/components/android/MainView.android.js')

var routes = require('./js/routes');
var constants = require('./js/constants');

var bevyios = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <Navigator
          initialRouteStack={[
            routes.MAIN.TABBAR
          ]}
          sceneStyle={{
            flex: 1,
            width: constants.width,
            height: constants.height
          }}
          renderScene={(route, navigator) => 
            <MainView 
              mainRoute={ route }
              mainNavigator={ navigator }
              { ...this.state }
            />
          }
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('bevyios', () => bevyios);

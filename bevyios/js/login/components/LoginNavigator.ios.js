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
  TouchableHighlight,
  Image,
} = React;

var Router = require('react-native-router');
var LoginView = require('./LoginView.ios.js');

var LeftButton = React.createClass({
  render: function () {
    return (
      <Image source={require('image!back_button')} style={styles.backButton} />
      );
  }
});

var LoginNavigator = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object
  },

  render: function () {

    var firstRoute = {
      name: '',
      component: LoginView,
      data: this.props.navigator
    }

    return (
      <View style={styles.container}>
        <Router
          backButtonComponent={LeftButton}
          headerStyle={styles.container}
          firstRoute={firstRoute}
        />
      </View>
    );
  }
});


var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
    padding: 0,
  },
  backButton: {
    width: 10,
    height: 17,
    marginLeft: 10,
    marginTop: 3,
    marginRight: 10
  }
});


module.exports = LoginNavigator;

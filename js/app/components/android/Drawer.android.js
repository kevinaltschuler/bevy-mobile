/**
 * Drawer.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TouchableNativeFeedback,
  StyleSheet
} = React;
var BevyList = require('./../../../bevy/components/android/BevyList.android.js');

var routes = require('./../../../routes');

var Drawer = React.createClass({
  propTypes: {
    mainRoute: React.PropTypes.object,
    mainNavigator: React.PropTypes.object,
    loggedIn: React.PropTypes.bool,
    user: React.PropTypes.object
  },

  _renderProfile() {
    if(!this.props.loggedIn) {
      return (
        <TouchableNativeFeedback
          onPress={() => {
            this.props.mainNavigator.push(routes.MAIN.LOGIN);
          }}
        >
          <View style={ styles.logInButton }>
            <Text style={ styles.logInButtonText }>Log In</Text>
          </View>
        </TouchableNativeFeedback>
      );
    } else {
      return (
        <View style={ styles.profileRow }>
          <Text style={ styles.displayName }>{ this.props.user.displayName }</Text>
        </View>
      );
    }
  },

  render() {
    return (
      <View style={ styles.container }>
        { this._renderProfile() }
        <BevyList { ...this.props } />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#222'
  },
  logInButton: {
    flexDirection: 'row',
    padding: 10
  },
  logInButtonText: {
    flex: 1,
    color: '#fff'
  }
});

module.exports = Drawer;
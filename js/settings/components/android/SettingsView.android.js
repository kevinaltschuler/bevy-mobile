/**
 * SettingsView.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  ScrollView,
  View,
  Text,
  TouchableNativeFeedback,
  StyleSheet
} = React;
var ProfileRow = require('./../../../user/components/android/ProfileRow.android.js');

var SettingsView = React.createClass({
  propTypes: {
    loggedIn: React.PropTypes.bool,
    user: React.PropTypes.object
  },

  _renderProfile() {
    if(this.props.loggedIn) {
      return (
        <ProfileRow 
          user={ this.props.user }
          nameColor='#000'
          emailColor='#000'
        />
      );
    } else {
      return (
        <TouchableNativeFeedback 
          onPress={() => {}}
        >
          <View style={ styles.logInButton }>
            <Text style={ styles.logInButtonText }>Log In</Text>
          </View>
        </TouchableNativeFeedback>
      );
    }
  },

  _renderLogOutButton() {
    if(!this.props.loggedIn) return <View />;
    return (
      <TouchableNativeFeedback
        onPress={() => {}}
      >
        <View style={ styles.logOutButton }>
          <Text style={ styles.logOutButtonText }>Log Out</Text>
        </View>
      </TouchableNativeFeedback>
    );
  },

  render() {
    return (
      <ScrollView style={ styles.container }>
        { this._renderProfile() }
        { this._renderLogOutButton() }
      </ScrollView>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  logInButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logInButtonText: {
    textAlign: 'center',
    color: '#000'
  },
  logOutButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  logOutButtonText: {
    textAlign: 'left',
    color: '#000'
  }
});

module.exports = SettingsView;
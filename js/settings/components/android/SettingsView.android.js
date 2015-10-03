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

var constants = require('./../../../constants');
var routes = require('./../../../routes');
var UserActions = require('./../../../user/UserActions');

var SettingsView = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    loggedIn: React.PropTypes.bool,
    user: React.PropTypes.object,
    tabActions: React.PropTypes.object
  },

  _renderProfile() {
    if(this.props.loggedIn) {
      return (
        <ProfileRow 
          user={ this.props.user }
          nameColor='#000'
          emailColor='#000'
          style={{
            marginTop: 10,
            marginBottom: 10,
            backgroundColor: '#FFF',
            borderBottomWidth: 1,
            borderBottomColor: '#DDD'
          }}
        />
      );
    } else {
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
    }
  },

  _renderLogOutButton() {
    if(!this.props.loggedIn) return <View />;
    return (
      <TouchableNativeFeedback
        onPress={() => {
          UserActions.logOut();
          // switch back to posts tab
          this.props.tabActions.switchTab('POSTS');
        }}
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
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 12,
    paddingRight: 12
  },
  logOutButtonText: {
    flex: 1,
    textAlign: 'left',
    color: '#000'
  }
});

module.exports = SettingsView;
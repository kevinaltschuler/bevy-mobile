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
var Icon = require('react-native-vector-icons/MaterialIcons');
var ProfileRow = require('./../../../user/components/android/ProfileRow.android.js');

var _ = require('underscore');
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

  goToPublicProfile() {
    // set the public profile user
    var route = routes.MAIN.PROFILE;
    route.user = this.props.user;
    // go to public profile view
    this.props.mainNavigator.push(route);
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

  _renderAccountsText() {
    if(!this.props.loggedIn) return <View />;
    else return (
      <Text style={ styles.settingHeader }>Account</Text>
    );
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

  _renderProfileButton() {
    if(!this.props.loggedIn) return <View />;
    else return (
      <TouchableNativeFeedback
        onPress={ this.goToPublicProfile }
      >
        <View style={ styles.settingButton }>
          <Text style={ styles.settingButtonText }>
            Go To Public Profile
          </Text>
          <Icon
            name='arrow-forward'
            size={ 30 }
            color='#888'
          />
        </View>
      </TouchableNativeFeedback>
    );
  },

  render() {
    return (
      <ScrollView style={ styles.container }>
        { this._renderProfile() }
        { this._renderAccountsText() }
        { this._renderLogOutButton() }
        { this._renderProfileButton() }
      </ScrollView>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  settingHeader: {
    color: '#AAA',
    marginLeft: 10,
    marginBottom: 4
  },
  settingButton: {
    backgroundColor: '#FFF',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10
  },
  settingButtonText: {
    flex: 1,
    color: '#000'
  },
  logInButton: {
    marginTop: 10,
    backgroundColor: '#FFF',
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
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

  goToAccounts() {

  },

  render() {
    if(!this.props.loggedIn) {
      return (
        <ScrollView style={ styles.container }>
          <TouchableNativeFeedback 
            onPress={() => {
              this.props.mainNavigator.push(routes.MAIN.LOGIN);
            }}
          >
            <View style={ styles.logInButton }>
              <Text style={ styles.logInButtonText }>Log In</Text>
            </View>
          </TouchableNativeFeedback>
        </ScrollView>
      );
    }

    return (
      <ScrollView style={ styles.container }>
        <ProfileRow 
          user={ this.props.user }
          nameColor='#000'
          emailColor='#000'
          style={{
            marginTop: 10,
            backgroundColor: '#FFF',
            borderBottomWidth: 1,
            borderBottomColor: '#DDD'
          }}
        />
        <Text style={ styles.settingHeader }>Account</Text>
        <TouchableNativeFeedback
          onPress={() => {
            UserActions.logOut();
            // switch back to posts tab
            this.props.tabActions.switchTab('POSTS');
          }}
        >
          <View style={ styles.settingButton }>
            <Icon
              name='exit-to-app'
              size={ 30 }
              color='#AAA'
            />
            <Text style={ styles.settingButtonText }>Log Out</Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
          onPress={ this.changePicture }
        >
          <View style={ styles.settingButton }>
            <Icon
              name='insert-photo'
              size={ 30 }
              color='#AAA'
            />
            <Text style={ styles.settingButtonText }>Change Profile Picture</Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
          onPress={ this.goToAccounts }
        >
          <View style={ styles.settingButton }>
            <Icon
              name='swap-horiz'
              size={ 30 }
              color='#AAA'
            />
            <Text style={ styles.settingButtonText }>
              Switch Accounts
            </Text>
            <Icon
              name='arrow-forward'
              size={ 30 }
              color='#888'
            />
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
          onPress={ this.goToPublicProfile }
        >
          <View style={ styles.settingButton }>
            <Icon 
              name='person'
              size={ 30 }
              color='#AAA'
            />
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
        <Text style={ styles.settingHeader }>
          App Settings
        </Text>
        <View style={ styles.settingButton }>
          <Text style={ styles.settingButtonText }>
            Placeholder Setting
          </Text>
        </View>
      </ScrollView>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#EEE'
  },
  settingHeader: {
    color: '#AAA',
    marginTop: 10,
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
    color: '#000',
    marginLeft: 10
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
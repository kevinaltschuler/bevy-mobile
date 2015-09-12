/**
 * SettingsView.ios.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  ScrollView,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet
} = React;
var {
  Icon
} = require('react-native-icons');

var Navbar = require('./../../shared/components/Navbar.ios.js');
var SettingsItem = require('./../../shared/components/SettingsItem.ios.js');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;

var _ = require('underscore');
var routes = require('./../../routes');
var UserActions = require('./../../user/UserActions');

var SettingsView = React.createClass({

  propTypes: {
    loggedIn: React.PropTypes.bool,
    user: React.PropTypes.object,
    mainNavigator: React.PropTypes.object,
    authModalActions: React.PropTypes.object
  },

  getInitialState() {
    return {
      profilePicture: (_.isEmpty(this.props.user.image_url)) ? '/img/user-profile-icon.png' : this.props.user.image_url
    };
  },

  _renderUserHeader() {
    if(!this.props.loggedIn) return <View />;

    return (
      <View style={ styles.profileHeader }>
        <Image 
          source={{ uri: this.state.profilePicture }}
          style={ styles.profileImage }
        />
        <View style={ styles.profileDetails }>
          <Text style={ styles.profileName }>{ this.props.user.displayName }</Text>
          <Text style={ styles.profileEmail }>{ this.props.user.email }</Text>
        </View>
      </View>
    );
  },

  _renderAccountSettings() {
    if(!this.props.loggedIn) {
      return (
        <SettingsItem
          title='Log In'
          onPress={() => {
            this.props.authModalActions.open('Log In');
          }}
        />
      );
    }

    return (
      <View style={{ flexDirection: 'column' }}>
        <SettingsItem
          title='View Public Profile'
          onPress={() => {
            var route = routes.MAIN.PROFILE;
            route.profileUser = this.props.user;
            this.props.mainNavigator.push(route);
          }}
        />
        <SettingsItem
          title='Change Profile Picture'
          onPress={() => {
            UIImagePickerManager.showImagePicker({
              title: 'Change Profile Picture',
              cancelButtonTitle: 'Cancel',
              takePhotoButtonTitle: 'Take Photo...',
              chooseFromLibraryButtonTitle: 'Choose from Library...',
              returnBase64Image: false,
              returnIsVertical: true
            }, (type, response) => {
              if (type !== 'cancel') {
                UserActions.changeProfilePicture(response);
                this.setState({
                  profilePicture: response
                });
              }
            });
          }}
        />
        <SettingsItem
          title='Sign Out'
          onPress={() => {
            UserActions.logOut();
          }}
        />
      </View>
    );
  },

  render() {
    return (
      <View style={ styles.container }>
        <Navbar
          center='Settings'
          { ...this.props }
        />
        <ScrollView style={ styles.scrollView }>
          { this._renderUserHeader() }

          <Text style={ styles.settingsTitle }>Account</Text>
          { this._renderAccountSettings() }

          <Text style={[ styles.settingsTitle, { marginTop: 15 } ]}>Settings</Text>
          <SettingsItem
            title='Placeholder Setting'
            onPress={() => {}}
            checked={ true }
          />
        </ScrollView>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee',
    flex: 1,
    flexDirection: 'column'
  },
  scrollView: {
    flex: 1
  },

  profileHeader: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10
  },
  profileDetails: {
    flex: 1,
    flexDirection: 'column'
  },
  profileName: {
    color: '#000', 
    fontSize: 15
  },
  profileEmail: {
    color: '#888', 
    fontSize: 12
  },

  settingsTitle: {
    color: '#888',
    fontSize: 15,
    marginLeft: 10,
    marginBottom: 5
  },
});

module.exports = SettingsView;
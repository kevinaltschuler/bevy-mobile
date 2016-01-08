/**
 * SettingsView.ios.js
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  ScrollView,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet,
} = React;
var Icon = require('react-native-vector-icons/Ionicons');
var Navbar = require('./../../../shared/components/ios/Navbar.ios.js');
var SettingsItem = require('./../../../shared/components/ios/SettingsItem.ios.js');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var resizeImage = require('./../../../shared/helpers/resizeImage');
var UserActions = require('./../../../user/UserActions');
var StatusBarSizeIOS = require('react-native-status-bar-size');

var SettingsView = React.createClass({
  propTypes: {
    loggedIn: React.PropTypes.bool,
    user: React.PropTypes.object,
    mainNavigator: React.PropTypes.object
  },

  getInitialState() {
    return {
      profilePicture: (_.isEmpty(this.props.user.image))
        ? constants.siteurl + '/img/user-profile-icon.png'
        : resizeImage(this.props.user.image, 64, 64).url
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      profilePicture: (_.isEmpty(nextProps.user.image_url))
        ? constants.siteurl + '/img/user-profile-icon.png'
        : resizeImage(this.props.user.image, 64, 64).url
    });
  },

  logOut() {
    UserActions.logOut();
    this.props.mainNavigator.popToTop();
    this.props.mainNavigator.push(routes.MAIN.LOGIN);
  },

  _renderUserHeader() {
    return (
      <View style={ styles.profileHeader }>
        <Image
          source={{ uri: this.state.profilePicture }}
          style={ styles.profileImage }
        />
        <View style={ styles.profileDetails }>
          <Text style={ styles.profileName }>
            { this.props.user.displayName }
          </Text>
          <Text style={ styles.profileEmail }>
            { this.props.user.email || 'no email' }
          </Text>
        </View>
      </View>
    );
  },

  _renderAccountSettings() {
    return (
      <View style={{ flexDirection: 'column' }}>
        <SettingsItem
          title='Change Profile Picture'
          icon={
            <Icon
              name={'ios-camera'}
              size={30}
              color='rgba(0,0,0,.3)'
            />
          }
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
                UserActions.changeProfilePicture(response.uri);
                //console.log(response)
                this.setState({
                  profilePicture: response.uri
                });
              }
            });
          }}
        />
        <SettingsItem
          title='View Public Profile'
          icon={
            <Icon
              name={'ios-person'}
              size={30}
              color='rgba(0,0,0,.3)'
            />
          }
          onPress={() => {
            var route = routes.MAIN.PROFILE;
            route.profileUser = this.props.user;
            this.props.mainNavigator.push(route);
          }}
        />
        <SettingsItem
          title='Sign Out'
          icon= {
            <Icon
              name={'ios-undo'}
              size={30}
              color='rgba(0,0,0,.3)'
            />
          }
          onPress={ this.logOut }
        />
      </View>
    );
  },

  render() {
    return (
      <View style={ styles.container }>
        <Navbar
          center={
            <Text style={{
              color: '#999',
              fontSize: 18,
              marginLeft: 10,
              fontWeight: 'bold'
            }}>
              Settings
            </Text>
          }
          activeBevy={ this.props.activeBevy }
          fontColor={ '#999' }
          { ...this.props }
          profilePicture={ this.state.profilePicture }
          styleBottom={{
            backgroundColor: '#fff',
            height: 40,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
            marginTop: 0,
            marginBottom: 0
          }}
        />
        <View style={{
          height: StatusBarSizeIOS.currentHeight
        }} />
        <ScrollView
          style={{ flex: 1, marginTop: -20 }}
          automaticallyAdjustContentInsets={ false }
        >
          { this._renderUserHeader() }

          <Text style={ styles.settingsTitle }>Account</Text>
          { this._renderAccountSettings() }

          <Text style={[ styles.settingsTitle, { marginTop: 15 } ]}>About</Text>
          <SettingsItem
            title={'Version: Beta 1.0'}
            onPress={() => {}}
            icon={
              <Icon
                name={'ios-flag'}
                size={30}
                color='rgba(0,0,0,.3)'
              />
            }
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
  settingItemContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingLeft: 10,
    paddingRight: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10
  },
  profileHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
    height: 48,
    backgroundColor: '#FFF',
    marginBottom: 5
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  profileDetails: {
    flex: 1,
    flexDirection: 'column',
    marginTop: -2
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

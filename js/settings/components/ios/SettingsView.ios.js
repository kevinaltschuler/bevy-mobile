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
var Icon = require('react-native-vector-icons/MaterialIcons');
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
      profilePicture: (_.isEmpty(nextProps.user.image))
        ? constants.siteurl + '/img/user-profile-icon.png'
        : resizeImage(nextProps.user.image, 64, 64).url
    });
  },

  logOut() {
    UserActions.logOut();
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
              name='camera-alt'
              size={ 30 }
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
              if (type !== 'cancel' && response) {
                UserActions.changeProfilePicture(response.uri);
                this.setState({
                  profilePicture: response.uri
                });
              }
            });
          }}
        />
        <SettingsItem
          title='View Profile'
          icon={
            <Icon
              name='person'
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
              name='exit-to-app'
              size={ 30 }
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
        <View style={ styles.topBarContainer }>
          <View style={{
            height: StatusBarSizeIOS.currentHeight,
            backgroundColor: '#2CB673'
          }}/>
          <View style={ styles.topBar }>
            <Text style={ styles.title }>
              Settings
            </Text>
          </View>
        </View>
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
            title={ 'Version: ' + constants.ios_version }
            icon={
              <Icon
                name='flag'
                size={ 30 }
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
  topBarContainer: {
    flexDirection: 'column',
    paddingTop: 0,
    overflow: 'visible',
    backgroundColor: '#2CB673'
  },
  topBar: {
    height: 48,
    backgroundColor: '#2CB673',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 17,
    textAlign: 'center',
    color: '#FFF'
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
    height: 60,
    backgroundColor: '#FFF',
    marginBottom: 10
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  profileDetails: {
    flex: 1,
    flexDirection: 'column'
  },
  profileName: {
    color: '#000',
    fontSize: 17
  },
  profileEmail: {
    color: '#888',
    fontSize: 15
  },
  settingsTitle: {
    color: '#888',
    fontSize: 17,
    marginLeft: 10,
    marginBottom: 5
  },
});

module.exports = SettingsView;

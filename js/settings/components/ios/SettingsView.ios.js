/**
 * SettingsView.ios.js
 *
 * Settings view for the app
 * Shows the logged in user and lets the user change their
 * profile. Also has some other miscellaneous options
 *
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
  RefreshControl,
  NativeModules
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var SettingsItem = require('./../../../shared/components/ios/SettingsItem.ios.js');
var FileStore = require('./../../../file/FileStore');
var FileActions = require('./../../../file/FileActions');
var UIImagePickerManager = NativeModules.UIImagePickerManager;

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var resizeImage = require('./../../../shared/helpers/resizeImage');
var UserActions = require('./../../../user/UserActions');
var UserStore = require('./../../../user/UserStore');
var USER = constants.USER;
var FILE = constants.FILE;

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
        : resizeImage(this.props.user.image, 64, 64).url,
      refreshing: false,
      displayName: this.props.user.displayName,
      email: this.props.user.email
    };
  },

  componentDidMount() {
    FileStore.on(FILE.UPLOAD_COMPLETE, this.onUpload);
    UserStore.on(USER.LOADING, this.onLoading);
    UserStore.on(USER.LOADED, this.onLoaded);
  },

  componentWillUnmount() {
    FileStore.off(FILE.UPLOAD_COMPLETE, this.onUpload);
    UserStore.off(USER.LOADING, this.onLoading);
    UserStore.off(USER.LOADED, this.onLoaded);
  },

  onUpload(file) {
    this.setState({ profilePicture: file.path });
    UserActions.changeProfilePicture(file);
  },

  onLoading() {
    this.setState({ refreshing: true });
  },
  onLoaded(newUser) {
    this.setState({
      refreshing: false,
      profilePicture: newUser.image.path,
      displayName: newUser.displayName,
      email: newUser.email
    });
  },

  onRefresh() {
    UserActions.fetch();
  },

  logOut() {
    UserActions.logOut();
  },

  goToProfileView() {
    var route = routes.MAIN.PROFILE;
    route.profileUser = this.props.user;
    this.props.mainNavigator.push(route);
  },

  goToPatchNotes() {
    this.props.mainNavigator.push(routes.MAIN.PATCHNOTES);
  },

  showImagePicker() {
    UIImagePickerManager.showImagePicker({
      title: 'Change Profile Picture',
      cancelButtonTitle: 'Cancel',
      takePhotoButtonTitle: 'Take Photo...',
      chooseFromLibraryButtonTitle: 'Choose from Library...',
      returnBase64Image: false,
      returnIsVertical: true
    }, (response) => {
      if (!response.didCancel) {
        FileActions.upload(response.uri);
      } else {
        console.log('Cancel');
      }
    });
  },

  submitFeedback() {
    this.props.mainNavigator.push(routes.MAIN.FEEDBACK);
  },

  _renderSeparator() {
    return (
      <View style={{
        width: constants.width,
        height: 1,
        flexDirection: 'row'
      }}>
        <View style={{
          width: 30 + 36,
          height: 1,
          backgroundColor: '#FFF'
        }}/>
        <View style={{
          flex: 1,
          height: 1,
          backgroundColor: '#EEE'
        }}/>
      </View>
    );
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
            { this.state.displayName }
          </Text>
          <Text style={ styles.profileEmail }>
            { this.state.email || 'no email' }
          </Text>
        </View>
      </View>
    );
  },

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.topBarContainer }>
          <View style={{
            height: constants.getStatusBarHeight(),
            backgroundColor: '#2CB673'
          }}/>
          <View style={ styles.topBar }>
            <Text style={ styles.title }>
              Settings
            </Text>
          </View>
        </View>
        <ScrollView
          ref={ ref => { this.ScrollView = ref; }}
          style={ styles.body }
          automaticallyAdjustContentInsets={ false }
          contentContainerStyle={ styles.bodyInner }
          refreshControl={
            <RefreshControl
              refreshing={ this.state.refreshing }
              onRefresh={ this.onRefresh }
              tintColor='#AAA'
              title='Loading...'
            />
          }
        >
          { this._renderUserHeader() }

          <Text style={ styles.settingsTitle }>Account</Text>
          <SettingsItem
            title='Change Profile Picture'
            icon={
              <Icon
                name='camera-alt'
                size={ 36 }
                color='rgba(0,0,0,.3)'
              />
            }
            onPress={ this.showImagePicker }
          />
          { this._renderSeparator() }
          <SettingsItem
            title='View Profile'
            icon={
              <Icon
                name='person'
                size={ 36 }
                color='rgba(0,0,0,.3)'
              />
            }
            onPress={ this.goToProfileView }
            showChevron
          />
          { this._renderSeparator() }
          <SettingsItem
            title='Sign Out'
            icon= {
              <Icon
                name='exit-to-app'
                size={ 36 }
                color='rgba(0,0,0,.3)'
              />
            }
            onPress={ this.logOut }
          />

          <Text style={[ styles.settingsTitle, { marginTop: 15 } ]}>About</Text>
          <SettingsItem
            title={ 'Version: ' + constants.ios_version }
            icon={
              <Icon
                name='flag'
                size={ 36 }
                color='rgba(0,0,0,.3)'
              />
            }
            showChevron
            onPress={ this.goToPatchNotes }
          />
          <SettingsItem
            title='Submit Feedback'
            icon={
              <Icon
                name='feedback'
                size={ 36 }
                color='rgba(0,0,0,0.3)'
              />
            }
            showChevron
            onPress={ this.submitFeedback }
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
  body: {
    flex: 1,
    flexDirection: 'column'
  },
  bodyInner: {
    paddingBottom: 60
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
    height: 80,
    backgroundColor: '#FFF',
    marginBottom: 10
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  profileDetails: {
    flex: 1,
    flexDirection: 'column'
  },
  profileName: {
    color: '#000',
    fontSize: 19
  },
  profileEmail: {
    color: '#888',
    fontSize: 17
  },
  settingsTitle: {
    color: '#888',
    fontSize: 17,
    marginLeft: 10,
    marginBottom: 5
  },
});

module.exports = SettingsView;

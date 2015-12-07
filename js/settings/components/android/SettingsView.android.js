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
  ToastAndroid,
  StyleSheet
} = React;
var Icon = require('./../../../shared/components/android/Icon.android.js');
var ProfileRow = require('./../../../user/components/android/ProfileRow.android.js');
var GoogleAuth = require('./../../../shared/components/android/GoogleAuth.android.js');
var ImagePickerManager = require('./../../../shared/apis/ImagePickerManager.android.js');
var DialogAndroid = require('react-native-dialogs');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var UserActions = require('./../../../user/UserActions');
var AppActions = require('./../../../app/AppActions');
var FileActions = require('./../../../file/FileActions');
var FileStore = require('./../../../file/FileStore');
var FILE = constants.FILE;

var SettingsView = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    mainRoute: React.PropTypes.object,
    loggedIn: React.PropTypes.bool,
    user: React.PropTypes.object,
    tabActions: React.PropTypes.object
  },

  getInitialState() {
    return {
    };
  },

  componentDidMount() {
    FileStore.on(FILE.UPLOAD_COMPLETE, this.onUploadComplete);
    FileStore.on(FILE.UPLOAD_ERROR, this.onUploadError);
  },
  componentWillUnmount() {
    FileStore.off(FILE.UPLOAD_COMPLETE, this.onUploadComplete);
    FileStore.off(FILE.UPLOAD_ERROR, this.onUploadError);
  },

  onUploadComplete(file) {
    // dont catch other upload complete events from new post view
    // or new bevy view or other stuff
    if(this.props.mainRoute.name != routes.MAIN.TABBAR.name) return;
    UserActions.changeProfilePicture(null, file);
  },
  onUploadError(error) {
    ToastAndroid.show(error.toString(), ToastAndroid.SHORT);
  },

  goToPublicProfile() {
    // set the public profile user
    var route = routes.MAIN.PROFILE;
    route.user = this.props.user;
    // go to public profile view
    this.props.mainNavigator.push(route);
  },

  changePicture() {
    var dialog = new DialogAndroid();
    dialog.set({
      title: 'Change Profile Picture',
      items: [
        'Take a Picture',
        'Choose from Library'
      ],
      cancelable: true,
      itemsCallback: (index, item) => {
        if(index == 0)
          this.openCamera();
        else
          this.openImageLibrary();
      }
    });
    dialog.show();
  },

  openCamera() {
    ImagePickerManager.launchCamera({}, this.uploadImage);
  },
  openImageLibrary() {
    ImagePickerManager.launchImageLibrary({}, this.uploadImage);
  },
  uploadImage(cancelled, response) {
    if(cancelled) return;
    FileActions.upload(response.uri);
  },

  goToAccounts() {
    this.props.mainNavigator.push(routes.MAIN.SWITCHACCOUNT);
  },

  logOut() {
    // go back to posts page
    this.props.tabActions.switchTab('POSTS');
    // clear user
    UserActions.logOut();
    // log out of google too just to be safe
    GoogleAuth.logout();
    // reload app
    AppActions.load();
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
          big={ true }
          user={ this.props.user }
          nameColor='#000'
          emailColor='#000'
          style={{
            marginTop: 10,
            backgroundColor: '#FFF'
          }}
        />
        <Text style={ styles.settingHeader }>Account</Text>
        <TouchableNativeFeedback
          onPress={ this.logOut }
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
              View Public Profile
            </Text>
            <Icon
              name='arrow-forward'
              size={ 30 }
              color='#888'
            />
          </View>
        </TouchableNativeFeedback>
        <Text style={ styles.settingHeader }>
          About
        </Text>
        <View style={ styles.settingButton }>
          <Icon
            name='flag'
            size={ 30 }
            color='#AAA'
          />
          <Text style={ styles.settingButtonText }>
            Version
          </Text>
          <Text style={ styles.settingButtonTextRight }>
            { constants.android_version + ' ' + constants.android_phase }
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
    backgroundColor: '#EEE',
    paddingTop: 10
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
  settingButtonTextRight: {
    color: '#000',
    marginRight: 10
  },
  logInButton: {
    marginTop: 10,
    backgroundColor: '#FFF',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  logInButtonText: {
    textAlign: 'left',
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
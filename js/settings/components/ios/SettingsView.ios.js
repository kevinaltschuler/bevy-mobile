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
  StyleSheet,
} = React;
var Icon = require('react-native-vector-icons/Ionicons');
var Navbar = require('./../../../shared/components/ios/Navbar.ios.js');
var SettingsItem = require('./../../../shared/components/ios/SettingsItem.ios.js');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var UserActions = require('./../../../user/UserActions');

var SettingsView = React.createClass({
  propTypes: {
    loggedIn: React.PropTypes.bool,
    user: React.PropTypes.object,
    mainNavigator: React.PropTypes.object,
    authModalActions: React.PropTypes.object
  },

  getInitialState() {
    return {
      profilePicture: (_.isEmpty(this.props.user.image_url)) ? constants.siteurl + '/img/user-profile-icon.png' : this.props.user.image_url
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      profilePicture: (_.isEmpty(nextProps.user.image_url)) ? constants.siteurl + '/img/user-profile-icon.png' : nextProps.user.image_url
    });
  },

  _renderUserHeader() {
    if(!this.props.loggedIn) return <View />;

    return (
      <TouchableHighlight
        underlayColor='rgba(200,200,200,1)'
        style={[ styles.settingItemContainer ]}
        onPress={() => {
        }}
      >
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          <View style={ styles.profileHeader }>
            <Image
              source={{ uri: this.state.profilePicture }}
              style={ styles.profileImage }
            />
            <View style={ styles.profileDetails }>
              <Text style={ styles.profileName }>{ this.props.user.displayName }</Text>
              <Text style={ styles.profileEmail }>{ this.props.user.email || 'no email' }</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  },

  _renderAccountSettings() {
    if(!this.props.loggedIn) {
      return (
        <SettingsItem
        icon={
          <Icon
            name={'person'}
            size={30}
            color='rgba(0,0,0,.3)'
          />
        }
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
          icon={<Icon
              name={'ios-person'}
              size={30}
              color='rgba(0,0,0,.3)'
            />}
          onPress={() => {
            var route = routes.MAIN.PROFILE;
            route.profileUser = this.props.user;
            this.props.mainNavigator.push(route);
          }}
        />
        {/*<SettingsItem
          title='Switch Account'
          icon={<Icon
              name={'ios-shuffle-strong'}
              size={30}
              color='rgba(0,0,0,.3)'
            />}
          onPress={() => {
            var route = routes.PROFILE.SWITCH_USER;
            route.profileUser = this.props.user;
            this.props.mainNavigator.push(route);
          }}
        />*/}
        <SettingsItem
          title='Sign Out'
          icon= {<Icon
              name={'ios-undo'}
              size={30}
              color='rgba(0,0,0,.3)'
            />}
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
          profilePicture={ this.state.profilePicture }
        />
        <ScrollView style={{ flex: 1, marginTop: (this.props.loggedIn) ? -20 : 0 }}>
          { this._renderUserHeader() }

          <Text style={ styles.settingsTitle }>Account</Text>
          { this._renderAccountSettings() }

          <Text style={[ styles.settingsTitle, { marginTop: 15 } ]}>About</Text>
          <SettingsItem
            title={'Version: Beta 1.0'}
            onPress={() => {}}
            icon={<Icon
              name={'ios-flag'}
              size={30}
              color='rgba(0,0,0,.3)'
            />}
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
    padding: 5,
    height: 39,
    backgroundColor: 'rgba(0,0,0,0)'
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

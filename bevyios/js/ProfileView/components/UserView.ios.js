/**
 * ProfileView.ios.js
 * kevin made this 
 * except plup hes cool
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  CameraRoll,
  AsyncStorage
} = React;

var {
  Icon
} = require('react-native-icons');

var UIImagePickerManager = require('NativeModules').UIImagePickerManager;

var constants = require('./../../constants.js');

var UserView = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object
  },

  handleLogout: function() {
    // remove google token
    AsyncStorage.removeItem('google_id');
    // remove user
    AsyncStorage.removeItem('user');

    this.props.navigator.push({ name: 'LoginNavigator', index: 0 });
  },

  onProfileChange: function() {
    console.log('get photos');
    /*CameraRoll.getPhotos({
      first: 0,
      groupTypes: 'SavedPhotos',
      assetType: 'Photos'
    }, this.handleUpload, this.handleUploadError);*/
    // Customize by sending any or all of the following keys:
    UIImagePickerManager.showImagePicker({
        'title': 'Select Avatar',
        'cancelButtonTitle': 'Cancel',
        'takePhotoButtonTitle': 'Take Photo...',
        'chooseFromLibraryButtonTitle': 'Choose from Library...'
      }, (type, response) => {

      if (type !== 'cancel') {
        var source;
        if (type === 'data') { // New photo taken -  response is the 64 bit encoded image data string
          source = {uri: 'data:image/jpeg;base64,' + response, isStatic: true};
        } else { // Selected from library - response is the URI to the local file asset
          source = {uri: response};
        }

        //this.setState({avatarSource:source});
        console.log(source);
      } else {
        console.log('Cancel');
      }
    });
  },

  handleUpload: function() {

  },

  handleUploadError: function(){

  },

  render: function () {

    var profileUrl = constants.getUser().image_url;

    return (
      <View style={styles.container}>
        <View style={styles.mainColumn}>
          <View style={styles.top}>
            <View style={styles.picButton}>
              <Image 
                style={styles.profileImage}
                source={{uri: profileUrl}}
              >
                <TouchableOpacity 
                  activeOpacity={.8}
                  style={styles.cameraTouchable}
                  onPress={ this.onProfileChange }
                >
                  <Icon
                    name='ion|ios-camera-outline'
                    size={40}
                    color='white'
                    style={styles.cameraIcon}
                  />
                </TouchableOpacity>
              </Image>
            </View>
            <View style={styles.profileDeetzColumn}>
              <Text style={styles.displayName}>
                {constants.getUser().displayName}
              </Text>
              <Text style={styles.details}>
                123 points
              </Text>
            </View>
            <View style={styles.actionRow}>
              <TouchableHighlight
                activeOpacity={.8}
                underlayColor='rgba(0,0,0,.1)'
                style={styles.deleteButton}
              >
                <Text style={styles.buttonDetails}>
                  Delete Account
                </Text>
              </TouchableHighlight>
              <TouchableHighlight
                activeOpacity={.8}
                underlayColor='rgba(0,0,0,.1)'
                style={styles.logoutButton}
                onPress={this.handleLogout}
              >
                <Text style={styles.buttonDetails}>
                  &nbsp;&nbsp;&nbsp;&nbsp;Logout&nbsp;&nbsp;&nbsp;&nbsp;
                </Text>
              </TouchableHighlight>
            </View>
          </View>

          <View style={styles.bottom}>

          </View>

        </View>
      </View>
    );
  },

});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1
  },
  row: {
    flexDirection: 'row'
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: 300,
    marginTop: 20,
    marginBottom: 10
  },
  mainColumn: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    flex: 1
  },
  top: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#2CB673',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  picButton: {
    width: 110,
    height: 110,
    borderRadius: 54,
    borderWidth: 1,
    borderColor: 'white',
    paddingTop: 4,
    paddingLeft: 4
  },
  cameraTouchable: {
    backgroundColor: 'rgba(0,0,0,0)'
  },
  cameraIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  profileDeetzColumn: {
    marginTop: 10
  },
  displayName: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center'
  },
  details: {
    color: 'white',
    textAlign: 'center'
  },
  deleteButton: {
    borderRightColor: 'white',
    borderRightWidth: 1,
    width: 150,
    height: 35,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  logoutButton: {
    width: 150,
    height: 35,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  buttonDetails: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12
  },
  bottom: {
    flex: 1
  },
})

module.exports = UserView;

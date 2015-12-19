/*
* BevyInfoView.ios.js
* Kevin made this.
* guess who just crawled out the muck or mire
*/
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  TouchableHighlight,
  ScrollView,
  View,
  Image,
  SwitchIOS,
  TouchableOpacity,
} = React;
var Icon = require('react-native-vector-icons/Ionicons');
var SubSwitch = require('./../../../app/components/ios/SubSwitch.ios.js');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;

var _ = require('underscore');
var constants = require('./../../../constants.js');
var routes = require('./../../../routes.js');
var BevyActions = require('./../../../bevy/BevyActions');
var BevyStore = require('./../../../bevy/BevyStore');
var FileActions = require('./../../../file/FileActions');
var FileStore = require('./../../../file/FileStore');
var FILE = constants.FILE;

var InfoView = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object,
    bevyRoute: React.PropTypes.object,
    bevyNavigator: React.PropTypes.object,
    user: React.PropTypes.object,
    loggedIn: React.PropTypes.bool,
    authModalActions: React.PropTypes.object
  },

  getInitialState() {
    var user = this.props.user;
    //console.log(user.bevies, this.props.activeBevy._id);
    
    var bevy = this.props.activeBevy;
    
    var bevyImage = bevy.image_url || bevy.image.filename || constants.siteurl + '/img/default_group_img.png' ;
    var defaultBevies = [
      '11sports', '22gaming', '3333pics',
      '44videos', '555music', '6666news', '777books'
    ];
    if(_.contains(defaultBevies, bevy._id)) {
      bevyImage = constants.apiurl + bevy.image_url;
    }
    return {
      subscribed: _.findWhere(user.bevies, { _id: this.props.activeBevy._id }) != undefined,
      public: true,
      bevyImageURI: bevyImage
    };
  },

  componentDidMount() {
    FileStore.on(FILE.UPLOAD_COMPLETE, (filename) => {
      this.setState({
        bevyImageURI: filename
      });
      BevyActions.update(
        this.props.activeBevy._id, // bevy id
        null, // name
        null, // description
        filename, // image_url
        null // settings
      );
    });
  },

  componentWillUnmount() {
    FileStore.off(FILE.UPLOAD_COMPLETE);
  },

  _renderImageButton() {
    // dont render this if you're not an admin
    if(!_.contains(this.props.activeBevy.admins, this.props.user._id)) return <View />;
    return (
      <TouchableOpacity
        activeOpacity={ .8 }
        style={ styles.cameraTouchable }
        onPress={() => {
          UIImagePickerManager.showImagePicker({
            title: 'Choose Bevy Picture',
            cancelButtonTitle: 'Cancel',
            takePhotoButtonTitle: 'Take Photo...',
            chooseFromLibraryButtonTitle: 'Choose from Library...',
            returnBase64Image: false,
            returnIsVertical: false
          }, (type, response) => {
            if (type !== 'cancel') {
              //console.log(response);
              FileActions.upload(response);
            } else {
              //console.log('Cancel');
            }
          });
        }}
      >
        <Icon
          name='ios-camera-outline'
          size={40}
          color='white'
          style={styles.cameraIcon}
        />
      </TouchableOpacity>
    );
  },

  _renderSubSwitch() {
    var user = this.props.user;
    var bevy = this.props.activeBevy;
    var subbed = _.find(this.props.user.bevies, function(bevyId){ return bevyId == bevy._id }) != undefined;
    // dont render this if you're an admin
    if(_.contains(bevy.admins, user._id)) return null;
    return (
      <View style={[ styles.actionRow, {
        marginTop: 15
      }]}>
        <Text style={ styles.settingsTitle }>Subscribe</Text>
        <View style={[ styles.switchContainer, {
          marginTop: 0,
          borderTopWidth: 1,
          borderTopColor: '#ddd',
          paddingHorizontal: 16
        }]}>
          <Text style={ styles.switchDescription }>Subscribed</Text>
          <SubSwitch
            subbed={subbed}
            loggedIn={ this.props.loggedIn }
            authModalActions={ this.props.authModalActions }
            bevy={bevy}
            user={user}
          />
        </View>
      </View>
    );
  },

  _renderAdminSettings() {
    // only render these for admins
    var user = this.props.user;
    var bevy = this.props.activeBevy;
    if(!_.contains(bevy.admins, user._id)) return null;
    return (
      <View style={[ styles.actionRow, {
        marginTop: 15
      }]}>
        <Text style={ styles.settingsTitle }>Admin Settings</Text>
        <TouchableHighlight
          underlayColor='rgba(0,0,0,0.1)'
          style={[ styles.switchContainer, {
            borderTopWidth: 1,
            borderTopColor: '#ddd'
          }]}
          onPress={() => {
            var settingsRoute = routes.BEVY.SETTINGS;
            settingsRoute.setting = 'posts_expire_in';
            this.props.bevyNavigator.push(settingsRoute);
          }}
        >
          <View style={ styles.settingContainer }>
            <Text style={ styles.settingDescription }>
              Posts Expire In
            </Text>
            <Text style={ styles.settingValue }>
              { bevy.settings.posts_expire_in } Days
            </Text>
          </View>
        </TouchableHighlight>
        <View style={ styles.switchContainer }>
            <Text style={ styles.switchDescription }>Public</Text>
            <SwitchIOS
              value={ this.state.public }
              onValueChange={(value) => {
                this.setState({
                  public: value
                });
              }}
            />
          </View>
      </View>
    );
  },

  _renderRelatedBevies() {
    var bevy = this.props.activeBevy;
    var relatedList = <View/>;
    if(!_.isEmpty(bevy.siblings)) {
      relatedList = [];
      for(var key in bevy.siblings) {
        var sibling = BevyStore.getBevy(bevy.siblings[key]);
        relatedList.push(
          <TouchableHighlight
            underlayColor='rgba(0,0,0,0.1)'
            style={[ styles.switchContainer, {
              borderTopWidth: .5,
              borderTopColor: '#ddd'
            }]}
            onPress={() => {
                this.props.bevyNavigator.pop();
                BevyActions.switchBevy(sibling._id);
              }
            }
          >
            <View style={styles.settingContainer}>
              <Image
                style={styles.relatedImage}
                source={{ uri: sibling.image_url }}
              />
              <Text style={styles.settingValue}>
                { sibling.name }
              </Text>
            </View>
          </TouchableHighlight>
          );
      }
    }
    return (
      <View style={[ styles.actionRow, {
        marginTop: 15
      }]}>
        <Text style={ styles.settingsTitle }>Related Bevies</Text>
        { relatedList }
      </View>
    );
  },

  _renderAdmins() {
    var admins = this.props.activeBevy.admins;
    var adminList = <View/>;
    if(!_.isEmpty(admins)) {
      adminList = [];
      for(var key in admins) {
        var admin = admins[key];
        adminList.push(
          <TouchableHighlight
            underlayColor='rgba(0,0,0,0.1)'
            style={[ styles.switchContainer, {
              borderTopWidth: .5,
              borderTopColor: '#ddd'
            }]}
            onPress={() => {
                var route = routes.MAIN.PROFILE;
                route.profileUser = admin;
                this.props.mainNavigator.push(route);
              }
            }
          >
            <View style={styles.settingContainer}>
              <Image
                style={styles.relatedImage}
                source={{ uri: admin.image.path }}
              />
              <Text style={styles.settingValue}>
                { admin.displayName }
              </Text>
            </View>
          </TouchableHighlight>
          );
      }
    }
    return (
      <View style={[ styles.actionRow, {
        marginTop: 15
      }]}>
        <Text style={ styles.settingsTitle }>Admins</Text>
        { adminList }
      </View>
    );
  },

  _renderCard() {
    var privacy = (this.props.activeBevy.settings.privacy == 0) ? 'Public' : 'Private';
    var privacyLogo = (this.props.activeBevy.settings.privacy == 0) ? 'earth' : 'locked';
    return (
        <View style={styles.infoRow} >
          <View style={styles.picButton}>
            <Image
              style={styles.profileImage}
              source={{ uri: this.state.bevyImageURI }}
            >
              { this._renderImageButton() }
            </Image>
          </View>

          <View style={styles.profileDeetzColumn}>
            <Text style={styles.displayName}>
              { this.props.activeBevy.name }
            </Text>
            <Text style={styles.description}>
              { this.props.activeBevy.description }
            </Text>
            <View style={ styles.details }>
              <Icon
                name='earth'
                size={ 15 }
                color='#888'
                style={{ width: 15, height: 15 }}
              />
              <Text style={ styles.detailText }> {privacy}  </Text>
              <Icon
                name='ios-people'
                size={ 15 }
                color='#888'
                style={{ width: 15, height: 15 }}
              />
              <Text style={ styles.detailText }> {this.props.activeBevy.subCount} Subscribers</Text>
            </View>
          </View>
        </View>

    );
  },

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.actionRow}>
          { this._renderCard() }
          { this._renderSubSwitch() }
          { this._renderAdmins() }
          { this._renderRelatedBevies() }
          { this._renderAdminSettings() }
        </ScrollView>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    flex: 1,
    backgroundColor: '#eee'
  },
  row: {
    flexDirection: 'row'
  },
  infoRow: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    margin: 0,
    marginBottom: 20,
    marginTop: 0,
    borderRadius: 2,
    shadowColor: '#000',
    shadowRadius: 1,
    shadowOpacity: .3,
    shadowOffset:  { width: 0, height: 0 }
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  relatedImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  picButton: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 0,
    borderColor: '#666',
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
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginLeft: 15
  },
  displayName: {
    fontSize: 24,
    textAlign: 'left',
    color: '#222'
  },
  description: {
    fontSize: 15,
    textAlign: 'left',
    color: '#666',
    width: constants.width - 150
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5
  },
  detailText: {
    color: '#888',
    fontSize: 14
  },
  actionRow: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    marginBottom: 24
  },
  settingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: '#fff',
    height: 47,
    paddingLeft: 16,
    paddingRight: 16,
  },
  settingsTitle: {
    color: '#888',
    fontSize: 15,
    marginLeft: 10,
    marginBottom: 5
  },
  settingDescription: {
    flex: 1,
    fontSize: 17,
    color: '#222'
  },
  settingValue: {
    fontSize: 17,
    color: '#888',

  },
  switchContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  switchDescription: {
    flex: 1,
    fontSize: 17,
    color: '#222'
  },
  switch: {

  }
})

module.exports = InfoView;

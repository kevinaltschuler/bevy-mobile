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

var UIImagePickerManager = require('NativeModules').UIImagePickerManager;

var _ = require('underscore');
var constants = require('./../../constants.js');
var FILE = constants.FILE;
var routes = require('./../../routes.js');
var BevyActions = require('./../BevyActions');
var BevyStore = require('./../BevyStore');
var FileActions = require('./../../file/FileActions');
var FileStore = require('./../../file/FileStore');
var SubSwitch = require('./../../app/components/SubSwitch.ios.js');

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
    return {
      subscribed: _.findWhere(user.bevies, { _id: this.props.activeBevy._id }) != undefined,
      public: true,
      bevyImageURI: this.props.activeBevy.image_url
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
      <View style={[ styles.switchContainer, {
        marginTop: -10,
        borderTopWidth: 1,
        borderTopColor: '#ddd'
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
        <View style={[ styles.switchContainer ]}>
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

  _renderCard() {
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
              <Text style={ styles.detailText }> Public  </Text>
              <Icon
                name='ios-people'
                size={ 15 }
                color='#888'
                style={{ width: 15, height: 15 }}
              />
              <Text style={ styles.detailText }> 18 Subscribers</Text>
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
          { this._renderAdminSettings() }
          { this._renderRelatedBevies() }
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
    margin: 10,
    marginBottom: 20,
    marginTop: -10,
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
  },
  settingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 0
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
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
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
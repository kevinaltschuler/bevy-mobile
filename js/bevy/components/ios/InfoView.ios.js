/**
 * InfoView.ios.js
 * @author kevin
 * @author albert
 * @flow
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
var Icon = require('react-native-vector-icons/MaterialIcons');
var SubSwitch = require('./../../../app/components/ios/SubSwitch.ios.js');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
var BevyNavbar = require('./BevyNavbar.ios.js');
var AdminItem = require('./AdminItem.ios.js');

var _ = require('underscore');
var constants = require('./../../../constants.js');
var routes = require('./../../../routes.js');
var resizeImage = require('./../../../shared/helpers/resizeImage');
var BevyActions = require('./../../../bevy/BevyActions');
var BevyStore = require('./../../../bevy/BevyStore');
var FileActions = require('./../../../file/FileActions');
var FileStore = require('./../../../file/FileStore');
var FILE = constants.FILE;

var InfoView = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object,
    activeBoard: React.PropTypes.object,
    bevyRoute: React.PropTypes.object,
    bevyNavigator: React.PropTypes.object,
    user: React.PropTypes.object
  },

  getInitialState() {
    var bevyImageURL = (_.isEmpty(this.props.activeBevy.image))
      ? constants.siteurl + '/img/default_group_img.png'
      : resizeImage(this.props.activeBevy.image, 64, 64).url;

    return {
      subscribed: _.findWhere(this.props.user.bevies,
        { _id: this.props.activeBevy._id }) != undefined,
      isAdmin: _.findWhere(this.props.activeBevy.admins,
        { _id: this.props.user._id }) != undefined,
      public: true,
      bevyImageURI: bevyImageURL
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      subscribed: _.findWhere(nextProps.user.bevies,
        { _id: nextProps.activeBevy._id }) != undefined,
      isAdmin: _.findWhere(nextProps.activeBevy.admins,
        { _id: nextProps.user._id }) != undefined,
    });
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

  goBack() {
    this.props.bevyNavigator.pop();
  },

  _renderBackButton() {
    return (
      <TouchableOpacity
        activeOpacity={ 0.5 }
        style={ styles.backButton }
        onPress={ this.goBack }
      >
        <Icon
          name='arrow-back'
          size={ 30 }
          color='#FFF'
        />
      </TouchableOpacity>
    );
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
          name='camera-alt'
          size={ 40 }
          color='#FFF'
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
    if(!this.state.isAdmin) return <View />;
    return (
      <View style={[ styles.actionRow, {
        marginTop: 15
      }]}>
        <Text style={ styles.settingsTitle }>Admin Settings</Text>
        <View style={ styles.switchContainer }>
          <Text style={ styles.switchDescription }>Public</Text>
          <SwitchIOS
            value={ this.state.public }
            onValueChange={(value) => {
              this.setState({ public: value });
            }}
          />
        </View>
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
          <AdminItem
            key={ 'adminitem:' + admin._id }
            admin={ admin }
            mainNavigator={ this.props.mainNavigator }
          />
        );
      }
    }
    return (
      <View style={[ styles.actionRow ]}>
        <Text style={ styles.settingsTitle }>Admins</Text>
        { adminList }
      </View>
    );
  },

  render() {
    return (
      <View style={ styles.container }>
        <BevyNavbar
          left={ this._renderBackButton() }
          center={ this.props.activeBevy.name }
          activeBevy={ this.props.activeBevy }
          activeBoard={ this.props.activeBoard }
        />
        <ScrollView style={ styles.actionRow }>
          { this._renderSubSwitch() }
          { this._renderAdmins() }
          { this._renderAdminSettings() }
        </ScrollView>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    backgroundColor: '#eee'
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    height: 40,
    paddingHorizontal: 8
  },
  cameraTouchable: {
    backgroundColor: 'rgba(0,0,0,0)'
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
    fontSize: 17,
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
    color: '#888'
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

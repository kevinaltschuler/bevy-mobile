/**
 * BevyInfoView.ios.js
 *
 * View the info of a bevy if subscribed
 * also doubles as the settings view if this
 * is being viewed by an admin
 *
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
  TouchableOpacity,
  AlertIOS,
  NativeModules
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var UIImagePickerManager = NativeModules.UIImagePickerManager;
var BevyNavbar = require('./BevyNavbar.ios.js');
var AdminItem = require('./AdminItem.ios.js');
var SettingsItem = require('./../../../shared/components/ios/SettingsItem.ios.js');

var _ = require('underscore');
var constants = require('./../../../constants.js');
var routes = require('./../../../routes.js');
var resizeImage = require('./../../../shared/helpers/resizeImage');
var BevyActions = require('./../../BevyActions');
var BevyStore = require('./../../../bevy/BevyStore');
var FileActions = require('./../../../file/FileActions');
var FileStore = require('./../../../file/FileStore');
var FILE = constants.FILE;

var BevyInfoView = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object,
    activeBoard: React.PropTypes.object,
    bevyRoute: React.PropTypes.object,
    bevyNavigator: React.PropTypes.object,
    user: React.PropTypes.object
  },

  getInitialState() {
    return {
      subscribed: _.contains(this.props.user.bevies, this.props.activeBevy._id),
      isAdmin: _.findWhere(this.props.activeBevy.admins,
        { _id: this.props.user._id }) != undefined,
      public: true,
      image: this.props.activeBevy.image
    };
  },

  componentWillReceiveProps(nextProps) {
  },

  componentDidMount() {
    FileStore.on(FILE.UPLOAD_COMPLETE, this.onFileUpload);
  },
  componentWillUnmount() {
    FileStore.off(FILE.UPLOAD_COMPLETE, this.onFileUpload);
  },

  onFileUpload(image) {
    this.setState({ image: image });
    BevyActions.update(
      this.props.activeBevy._id, // bevy id
      null, // name
      null, // description
      image, // image
      null // settings
    );
  },

  goBack() {
    this.props.mainNavigator.pop();
  },

  changeName() {
    AlertIOS.prompt(
      'Change Bevy Name',
      null,
      [{
        text: 'Cancel',
        style: 'cancel'
      }, {
        text: 'Save',
        style: 'default',
        onPress: (name) => {
          BevyActions.update(this.props.activeBevy._id, name);
        }
      }],
      'plain-text',
      this.props.activeBevy.name
    );
  },

  updateBevy() {

  },

  showImagePicker() {
    UIImagePickerManager.showImagePicker({
      title: 'Choose Bevy Picture',
      cancelButtonTitle: 'Cancel',
      takePhotoButtonTitle: 'Take Photo...',
      chooseFromLibraryButtonTitle: 'Choose from Library...',
      returnBase64Image: false,
      returnIsVertical: false
    }, (type, response) => {
      if(response) {
        //console.log(response);
        FileActions.upload(response);
      } else {
        //console.log('Cancel');
      }
    });
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

  _renderAdminSettings() {
    if(!this.state.isAdmin) return <View />;
    return (
      <View style={[ styles.actionRow ]}>
        <Text style={ styles.settingsTitle }>
          Bevy Settings
        </Text>
        <SettingsItem
          icon={
            <Icon
              name='edit'
              size={ 30 }
              color='#AAA'
            />
          }
          title='Change Bevy Name'
          onPress={ this.changeName }
        />
        { this._renderSeparator() }
        {/*<SettingsItem
          icon={
            <Icon
              name='link'
              size={ 30 }
              color='#AAA'
            />
          }
          title='Change Bevy URL'
          onPress={ this.changeSlug }
        />*/}
        <SettingsItem
          icon={
            <Icon
              name='add-a-photo'
              size={ 30 }
              color='#AAA'
            />
          }
          title='Change Bevy Picture'
          onPress={ this.showImagePicker }
        />

        <Text style={ styles.settingsTitle }>
          Danger Zone
        </Text>
        <SettingsItem
          icon={
            <Icon
              name='delete'
              size={ 30 }
              color='#FFF'
            />
          }
          title='Delete Bevy'
          onPress={ this.deleteBevy }
          textColor='#FFF'
          bgColor='#D9534F'
        />
      </View>
    );
  },

  _renderAdmins() {
    var admins = this.props.activeBevy.admins;
    var adminList = [];
    if(!_.isEmpty(admins)) {
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
        <Text style={ styles.settingsTitle }>
          Admins
        </Text>
        { adminList }
      </View>
    );
  },

  _renderSeparator() {
    return (
      <View style={{
        width: constants.width,
        height: StyleSheet.hairlineWidth,
        flexDirection: 'row'
      }}>
        <View style={{
          width: 30 + 30,
          height: StyleSheet.hairlineWidth,
          backgroundColor: '#FFF'
        }}/>
        <View style={{
          flex: 1,
          height: StyleSheet.hairlineWidth,
          backgroundColor: '#EEE'
        }}/>
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
        <ScrollView
          style={ styles.body }
          contentContainerStyle={ styles.bodyInner }
        >
          <Text style={ styles.settingsTitle }>
            General
          </Text>
          <View style={ styles.urlItem }>
            <Icon
              name='link'
              size={ 30 }
              color='#AAA'
            />
            <Text style={ styles.urlTitle }>
              URL
            </Text>
            <Text
              style={ styles.urlValue }
              numberOfLines={ 2 }
            >
              { `${this.props.activeBevy.slug}.${constants.domain}` }
            </Text>
          </View>
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
  body: {

  },
  bodyInner: {
  },
  cameraTouchable: {
    backgroundColor: 'rgba(0,0,0,0)'
  },

  actionRow: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    marginBottom: 10
  },
  settingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: '#fff',
    height: 60,
  },
  settingsTitle: {
    color: '#888',
    fontSize: 17,
    marginLeft: 10,
    marginBottom: 5,
    marginTop: 10
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
  urlItem: {
    backgroundColor: '#FFF',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15
  },
  urlTitle: {
    marginHorizontal: 15,
    fontSize: 17,
    color: '#222'
  },
  urlValue: {
    flex: 1,
    textAlign: 'left',
    fontSize: 17,
    color: '#888',
    marginRight: 15
  },
  switchContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 15,
    marginTop: 0
  },
  switchDescription: {
    flex: 1,
    fontSize: 17,
    color: '#222'
  },
  deleteButton: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D9534F'
  },
  deleteButtonText: {
    flex: 1,
    color: '#FFF',
    fontSize: 17,
    marginLeft: 10
  }
});

module.exports = BevyInfoView;

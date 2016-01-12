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
  AlertIOS,
  NativeModules
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var SubSwitch = require('./../../../app/components/ios/SubSwitch.ios.js');
var UIImagePickerManager = NativeModules.UIImagePickerManager;
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
    return {
      subscribed: _.findWhere(this.props.user.bevies,
        { _id: this.props.activeBevy._id }) != undefined,
      isAdmin: _.findWhere(this.props.activeBevy.admins,
        { _id: this.props.user._id }) != undefined,
      public: true
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
    FileStore.on(FILE.UPLOAD_COMPLETE, image => {
      BevyActions.update(
        this.props.activeBevy._id, // bevy id
        null, // name
        null, // description
        image, // image
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

  deleteBevy() {
    AlertIOS.alert(
      'Are you sure you want to delete this bevy?',
      "Deleting a bevy will also delete all of it's associated boards and posts",
      [{
        text: 'Confirm',
        onPress: this.deleteBevyForSure
      }, {
        text: 'Cancel',
        style: 'cancel'
      }]
    );
  },

  deleteBevyForSure() {
    BevyActions.destroy(this.props.activeBevy._id);
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

  _renderSubSwitch() {
    // dont render this if you're an admin
    if(this.state.isAdmin) return <View />;
    return (
      <View style={ styles.actionRow }>
        <Text style={ styles.settingsTitle }>Subscribe</Text>
        <View style={[ styles.switchContainer, {
          marginTop: 0,
          borderTopWidth: 1,
          borderTopColor: '#ddd',
          paddingHorizontal: 16
        }]}>
          <Text style={ styles.switchDescription }>Subscribed</Text>
          <SubSwitch
            subbed={ this.state.subscribed }
            loggedIn={ this.props.loggedIn }
            bevy={ this.props.bevy }
            user={ this.props.user }
          />
        </View>
      </View>
    );
  },

  _renderAdminSettings() {
    if(!this.state.isAdmin) return <View />;
    return (
      <View style={[ styles.actionRow ]}>
        <Text style={ styles.settingsTitle }>Bevy Settings</Text>
        <TouchableOpacity
          activeOpacity={ 0.5 }
          onPress={ this.showImagePicker }
        >
          <View style={ styles.settingContainer }>
            <Icon name='camera-alt' size={30} color='#666' style={{marginLeft: 10, marginRight: 10}}/>
            <Text style={ styles.settingDescription }>
              Change Bevy Picture
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={ 0.7 }
          style={ styles.deleteButton }
          onPress={ this.deleteBevy }
        >
          <View style={ styles.deleteButton }>
            <Icon name='delete' size={30} color='#fff' style={{marginLeft: 10}}/>
            <Text style={ styles.deleteButtonText }>
              Delete Bevy
            </Text>
          </View>
        </TouchableOpacity>
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
        <ScrollView
          style={ styles.scrollView }
          contentContainerStyle={{
            paddingTop: 15
          }}
        >
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
  scrollView: {
    //paddingTop: 15
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
    height: 60,
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
    height: 60,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
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
})

module.exports = InfoView;

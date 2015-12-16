/**
 * BevyInfoView.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  ScrollView,
  Text,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  Image,
  SwitchAndroid,
  ToastAndroid,
  BackAndroid,
  StyleSheet
} = React;
var Icon = require('./../../../shared/components/android/Icon.android.js');
var BevyBar = require('./BevyBar.android.js');
var BevyAdminItem = require('./BevyAdminItem.android.js');
var Dropdown = require('react-native-dropdown-android');
var ImagePickerManager = require('./../../../shared/apis/ImagePickerManager.android.js');
var DialogAndroid = require('react-native-dialogs');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var UserStore = require('./../../../user/UserStore');
var BevyActions = require('./../../BevyActions');
var BevyStore = require('./../../BevyStore');
var FileActions = require('./../../../file/FileActions');
var FileStore = require('./../../../file/FileStore');
var FILE = constants.FILE;

var BevyInfoView = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object,
    bevyNavigator: React.PropTypes.object,
    bevyRoute: React.PropTypes.object,
    mainNavigator: React.PropTypes.object,
    user: React.PropTypes.object,
    loggedIn: React.PropTypes.bool
  },

  getInitialState() {
    return {
      subscribed: _.contains(this.props.user.bevies, this.props.activeBevy._id),
      isAdmin: _.findWhere(this.props.activeBevy.admins,
        { _id: this.props.user._id }) != undefined
    };
  },

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.onBackButton);
    FileStore.on(FILE.UPLOAD_COMPLETE, this.onUploadComplete);
    FileStore.on(FILE.UPLOAD_ERROR, this.onUploadError);
  },
  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.onBackButton);
    FileStore.off(FILE.UPLOAD_COMPLETE, this.onUploadComplete);
    FileStore.off(FILE.UPLOAD_ERROR, this.onUploadError);
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      subscribed: _.contains(nextProps.user.bevies, nextProps.activeBevy._id),
      isAdmin: _.findWhere(nextProps.activeBevy.admins,
        { _id: nextProps.user._id }) != undefined
    });
  },

  onBackButton() {
    this.props.bevyNavigator.pop();
    return true;
  },

  onToggleSubscribe(value) {
    this.setState({
      subscribed: value
    });
    if(value) {
      BevyActions.subscribe(this.props.activeBevy._id);
    } else {
      BevyActions.unsubscribe(this.props.activeBevy._id);
    }
  },

  requestJoin() {
    // dont allow this for non logged in users
    if(!this.props.loggedIn) {
      ToastAndroid.show('Please Log In to Join a Bevy', ToastAndroid.SHORT);
      return;
    }
    // send action
    BevyActions.requestJoin(this.props.activeBevy, this.props.user);
  },

  goToRelated() {
    // go to related bevies view
    this.props.bevyNavigator.push(routes.BEVY.RELATED);
  },

  goToTags() {
    // go to tag view
    this.props.bevyNavigator.push(routes.BEVY.TAGS);
  },

  changePicture() {
    var dialog = new DialogAndroid();
    dialog.set({
      title: 'Change Bevy Picture',
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

  onUploadComplete(file) {
    BevyActions.update(
      this.props.activeBevy._id,
      this.props.activeBevy.name,
      this.props.activeBevy.description,
      file,
      this.props.activeBevy.settings
    );
  },
  onUploadError(error) {
    ToastAndroid.show(error.toString(), ToastAndroid.SHORT);
  },

  openImage() {
    if(_.isEmpty(this.props.activeBevy.image)) return;
    var actions = constants.getImageModalActions();
    constants.setImageModalImages([this.props.activeBevy.image]);
    actions.show();
  },

  updateBevySettings(settings) {
    BevyActions.update(
      this.props.activeBevy._id,
      this.props.activeBevy.name,
      this.props.activeBevy.description,
      this.props.activeBevy.image,
      settings
    );
  },

  deleteBevy() {
    // delete bevy action
    BevyActions.destroy(this.props.activeBevy._id);
    // go back to frontpage
    BevyActions.switchBevy('-1');
  },

  getPostsExpireInIndex() {
    switch(this.props.activeBevy.settings.posts_expire_in) {
      case -1:
        return 0;
        break;
      case 1:
        return 1;
        break;
      case 2:
        return 2;
        break;
      case 5:
        return 3;
        break;
      case 7:
        return 4;
        break;
    }
  },

  _renderAdmins() {
    var bevyAdmins = this.props.activeBevy.admins;
    var admins = [];
    for(var key in bevyAdmins) {
      var admin = bevyAdmins[key];
      admins.push(
        <BevyAdminItem
          key={ 'bevyadminitem:' + admin._id }
          admin={ admin }
          activeBevy={ this.props.activeBevy }
          mainNavigator={ this.props.mainNavigator }
        />
      );
    }
    if(_.isEmpty(admins)) {
      return (
        <Text style={ styles.noAdmins }>No Admins</Text>
      );
    } else return admins;
  },

  _renderSubscribe() {
    // check if bevy is private
    if(this.props.activeBevy._id != -1 // if not the frontpage
      && this.props.activeBevy.settings.privacy == 1
      && !_.contains(this.props.user.bevies, this.props.activeBevy._id)) {
      return (
        <View style={ styles.settingItem }>
          <Text style={ styles.settingText }>Subscribed</Text>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#FFF', false) }
            onPress={ this.requestJoin }
          >
            <View style={{
              backgroundColor: '#2CB673',
              marginRight: -10,
              height: 48,
              paddingHorizontal: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Text style={{
                color: '#FFF'
              }}>
                Request to Join
              </Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      );
    }

    return (
      <View style={ styles.settingItem }>
        <Text style={ styles.settingText }>Subscribed</Text>
        <SwitchAndroid
          value={ this.state.subscribed }
          onValueChange={(value) => this.onToggleSubscribe(value)}
        />
      </View>
    );
  },

  _renderBevySettings() {
    if(!this.state.isAdmin) return <View />;
    return (
      <View>
        <Text style={ styles.settingTitle }>Bevy Settings</Text>
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#EEE', false) }
          onPress={ this.changePicture }
        >
          <View style={ styles.settingItem }>
            <Text style={ styles.settingItemText }>
              Change Bevy Picture
            </Text>
          </View>
        </TouchableNativeFeedback>
        <View style={ styles.settingItem }>
          <Text style={ styles.settingText }>Privacy</Text>
          <Dropdown
            style={{ height: 20, width: 200}}
            values={[
              'Public',
              'Private'
            ]}
            selected={ this.props.activeBevy.settings.privacy }
            onChange={data => {
              var settings = this.props.activeBevy.settings;
              settings.privacy = data.selected;

              // if nothing has changed, dont send the action
              if(settings.privacy == this.props.activeBevy.settings.privacy)
                return;

              this.updateBevySettings(settings);
            }}
          />
        </View>
        <View style={ styles.settingItem }>
          <Text style={ styles.settingText }>Posts Expire In</Text>
          <Dropdown
            style={{ height: 20, width: 200 }}
            values={[
              'Never',
              '1 Day',
              '2 Days',
              '5 Days',
              '7 Days'
            ]}
            selected={ this.getPostsExpireInIndex() }
            onChange={data => {
              var posts_expire_in = data.selected;
              var settings = this.props.activeBevy.settings;
              switch(data.selected) {
                case 0:
                  posts_expire_in = -1
                  break;
                case 1:
                  posts_expire_in = 1;
                  break;
                case 2:
                  posts_expire_in = 2;
                  break;
                case 3:
                  posts_expire_in = 5;
                  break;
                case 4:
                  posts_expire_in = 7;
                  break;
              }
              settings.posts_expire_in = posts_expire_in;

              // dont do anything if nothing has changed
              if(posts_expire_in == this.props.activeBevy.settings.posts_expire_in)
                return;

              this.updateBevySettings(settings);
            }}
          />
        </View>
        <View style={ styles.settingItem }>
          <Text style={ styles.settingText }>Enable Group Chat</Text>
          <SwitchAndroid
            value={ this.props.activeBevy.settings.group_chat }
            onValueChange={value => {
              var settings = this.props.activeBevy.settings;
              settings.group_chat = value;

              // if nothing has changed, dont send the action
              if(settings.group_chat == this.props.activeBevy.settings.group_chat)
                  return;

              this.updateBevySettings(settings);
            }}
          />
        </View>
      </View>
    );
  },

  _renderDangerZone() {
    if(!this.state.isAdmin) return <View />;
    return (
      <View style={{ flex: 1 }}>
        <Text style={ styles.settingTitle }>Danger Zone</Text>
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#ED8372') }
          onPress={ this.deleteBevy }
        >
          <View style={[ styles.settingItem, { backgroundColor: '#DF4A32' } ]}>
            <Text style={[ styles.settingText, { color: '#FFF' } ]}>Delete Bevy</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  },

  render() {
    return (
      <View style={ styles.container }>
        <BevyBar
          activeBevy={ this.props.activeBevy }
          bevyNavigator={ this.props.bevyNavigator }
          bevyRoute={ this.props.bevyRoute }
        />
        <ScrollView
          contentContainerStyle={{
            backgroundColor: '#EEE'
          }}
        >
          <View style={ styles.header }>
            <TouchableWithoutFeedback
              onPress={ this.openImage }
            >
              <Image
                source={ BevyStore.getBevyImage(this.props.activeBevy._id, 100, 100) }
                style={ styles.bevyImage }
              />
            </TouchableWithoutFeedback>
            <View style={ styles.bevyDetails }>
              <Text style={ styles.bevyName }>
                { this.props.activeBevy.name.trim() }
              </Text>
              <Text style={ styles.bevyDescription }>
                { _.isEmpty(this.props.activeBevy.description)
                  ? 'No Description'
                  : this.props.activeBevy.description.trim() }
              </Text>
              <View style={ styles.bevyDetailsBottom }>
                <Icon
                  name='public'
                  size={ 16 }
                  color='#AAA'
                />
                <Text style={ styles.publicOrPrivate }>
                  { (this.props.activeBevy.settings.privacy == 1)
                      ? 'Private'
                      : 'Public' }
                </Text>
                <Icon
                  name='group'
                  size={ 16 }
                  color='#AAA'
                  style={{ marginLeft: 6 }}
                />
                <Text style={ styles.subCount }>
                  { this.props.activeBevy.subCount } Subscribers
                </Text>
              </View>
            </View>
          </View>
          <Text style={ styles.settingTitle }>General</Text>
          { this._renderSubscribe() }
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#EEE', false) }
            onPress={ this.goToRelated }
          >
            <View style={ styles.settingItem }>
              <Text style={ styles.settingText }>Related Bevies</Text>
              <Icon
                name='arrow-forward'
                size={ 30 }
                color='#AAA'
              />
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#EEE', false) }
            onPress={ this.goToTags }
          >
            <View style={ styles.settingItem }>
              <Text style={ styles.settingText }>Bevy Tags</Text>
              <Icon
                name='arrow-forward'
                size={ 30 }
                color='#AAA'
              />
            </View>
          </TouchableNativeFeedback>
          <Text style={ styles.settingTitle }>Admins</Text>
          { this._renderAdmins() }

          { this._renderBevySettings() }
          { this._renderDangerZone() }

          <View style={{ height: 15 }} />
        </ScrollView>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE'
  },
  header: {
    height: 100,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    //margin: 5,
    //borderRadius: 5,
    //elevation: 2
  },
  bevyImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 10
  },
  bevyDetails: {
    height: 100,
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  bevyName: {
    fontSize: 22,
    color: '#888',
    flexWrap: 'wrap'
  },
  bevyDescription: {
    width: constants.width - 10 - 60 - 10 - 10,
    color: '#AAA',
    marginBottom: 5,
    flexWrap: 'wrap'
  },
  bevyDetailsBottom: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  publicOrPrivate: {
    marginHorizontal: 4,
  },
  subCount: {
    marginHorizontal: 4
  },

  settingTitle: {
    color: '#AAA',
    marginTop: 10,
    marginBottom: 4,
    marginLeft: 10
  },
  settingItem: {
    backgroundColor: '#FFF',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  settingText: {
    flex: 1,
    color: '#666'
  }
});

module.exports = BevyInfoView;

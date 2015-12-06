/**
 * ThreadSettingsView.android.js
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
  ListView,
  BackAndroid,
  ToastAndroid,
  TouchableNativeFeedback
} = React;
var Icon = require('./../../../shared/components/android/Icon.android.js');
var ThreadImage = require('./ThreadImage.android.js');
var PersonItem = require('./PersonItem.android.js');
var ImagePickerManager = require('./../../../shared/apis/ImagePickerManager.android.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var ChatActions = require('./../../../chat/ChatActions');
var ChatStore = require('./../../../chat/ChatStore');
var FileActions = require('./../../../file/FileActions');
var FileStore = require('./../../../file/FileStore');
var CHAT = constants.CHAT;
var FILE = constants.FILE;

var ThreadSettingsView = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    activeThread: React.PropTypes.object,
    user: React.PropTypes.object
  },

  componentDidMount() {
    ChatStore.on(CHAT.SWITCH_TO_THREAD, this.onSwitchToThread);
    BackAndroid.addEventListener('hardwareBackPress', this.onBackButton);
    FileStore.on(FILE.UPLOAD_COMPLETE, this.onUploadComplete);
    FileStore.on(FILE.UPLOAD_ERROR, this.onUploadError);
  },
  componentWillUnmount() {
    ChatStore.off(CHAT.SWITCH_TO_THREAD, this.onSwitchToThread);
    BackAndroid.removeEventListener('hardwareBackPress', this.onBackButton);
    FileStore.off(FILE.UPLOAD_COMPLETE, this.onUploadComplete);
    FileStore.off(FILE.UPLOAD_ERROR, this.onUploadError);
  },

  onUploadComplete(file) {
    ChatActions.editThread(this.props.activeThread._id, null, file);
  },
  onUploadError(error) {
    ToastAndroid.show(error.toString(), ToastAndroid.SHORT);
  },

  onSwitchToThread(thread_id) {
    // need skip the message and settings view
    // so were just manually resetting the stack to go directly
    // to the new thread
    this.props.mainNavigator.immediatelyResetRouteStack([
      routes.MAIN.TABBAR,
      routes.MAIN.MESSAGEVIEW
    ]);
  },

  onBackButton() {
    this.props.mainNavigator.pop();
    return true;
  },

  goBack() {
    this.props.mainNavigator.pop();
  },

  changePicture() {
    constants.getActionSheetActions().show(
      [
        "Take a Picture",
        "Choose from Library"
       ],
      function(key, option) {
        //console.log(key);
        switch(option) {
          case "Take a Picture":
            this.openCamera();
            break;
          case "Choose from Library":
            this.openImageLibrary();
            break;
        }
      }.bind(this),
      'Change Thread Picture'
    );
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

  changeName() {

  },

  leaveConversation() {
    ChatActions.removeUser(this.props.activeThread._id, this.props.user._id);
    // go back to tab bar
    this.props.mainNavigator.popToTop();
  },

  deleteConversation() {
    ChatActions.deleteThread(this.props.activeThread._id);
    // go back to tab bar
    this.props.mainNavigator.popToTop();
  },

  _renderPeople() {
    var people = [];
    for(var key in this.props.activeThread.users) {
      var person = this.props.activeThread.users[key];
      // dont render self
      if(person._id == this.props.user._id) continue;
      people.push(
        <PersonItem
          key={ 'personitem:' + key }
          user={ person }
        />
      );
    }
    return people;
  },

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.topBar }>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#62D487', false) }
            onPress={ this.goBack }
          >
            <View style={ styles.backButton }>
              <Icon
                name='arrow-back'
                size={ 30 }
                color='#FFF'
              />
            </View>
          </TouchableNativeFeedback>
          <Text style={ styles.title }>
            { (this.props.activeThread.type == 'group') 
              ? 'Group Details'
              : 'Details' }
          </Text>
        </View>
        <ScrollView style={ styles.contentContainer }>
          <View style={ styles.header }>
            <ThreadImage
              thread={ this.props.activeThread }
            />
            <View style={ styles.headerDetails }>
              <Text style={ styles.threadName }>
                { ChatStore.getThreadName(this.props.activeThread._id) }
              </Text>
            </View>
          </View>
          <Text style={ styles.sectionTitle }>
            Settings
          </Text>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#DDD', false) }
            onPress={ this.changePicture }
          >
            <View style={ styles.settingButton }>
              <Icon
                name='photo'
                size={ 36 }
                color='#AAA'
              />
              <Text style={ styles.settingText }>
                Change Picture
              </Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#DDD', false) }
            onPress={ this.changeName }
          >
            <View style={ styles.settingButton }>
              <Icon
                name='create'
                size={ 36 }
                color='#AAA'
              />
              <Text style={ styles.settingText }>
                Change Name
              </Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#DDD', false) }
            onPress={ this.leaveConversation }
          >
            <View style={ styles.settingButton }>
              <Icon
                name='exit-to-app'
                size={ 36 }
                color='#AAA'
              />
              <Text style={ styles.settingText }>
                Leave Conversation
              </Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#DDD', false) }
            onPress={ this.deleteConversation }
          >
            <View style={ styles.settingButton }>
              <Icon
                name='delete'
                size={ 36 }
                color='#AAA'
              />
              <Text style={ styles.settingText }>
                Delete Conversation
              </Text>
            </View>
          </TouchableNativeFeedback>

          <Text style={ styles.sectionTitle }>
            People
          </Text>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#DDD', false) }
            onPress={ this.addPeople }
          >
            <View style={ styles.settingButton }>
              <Icon
                name='add-circle-outline'
                size={ 36 }
                color='#2CB673'
              />
              <Text style={ styles.settingText }>
                Add People
              </Text>
            </View>
          </TouchableNativeFeedback>
          { this._renderPeople() }
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
  topBar: {
    width: constants.width,
    height: 48,
    backgroundColor: '#2CB673',
    borderBottomColor: '#EEE',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  backButton: {
    height: 48,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10
  },
  title: {
    color: '#FFF',
    textAlign: 'left',
    flex: 1,
    fontSize: 18
  },
  contentContainer: {
    flex: 1
  },
  header: {
    height: 48,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  headerDetails: {
    flex: 1,
    height: 48,
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 10,
    flexWrap: 'wrap'
  },
  threadName: {
    color: '#000',
    flexWrap: 'wrap'
  },
  sectionTitle: {
    color: '#AAA',
    marginLeft: 10,
    marginBottom: 5,
    marginTop: 10
  },
  settingButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#FFF'
  },
  settingText: {
    flex: 1,
    color: '#000',
    marginLeft: 10
  }
});

module.exports = ThreadSettingsView;
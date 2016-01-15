/**
 * ThreadSettingsView.ios.js
 * @author albert
 * @author kevin
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
  TouchableOpacity,
  TouchableHighlight,
  AlertIOS
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var ThreadImage = require('./ThreadImage.ios.js');
var PersonItem = require('./PersonItem.ios.js');
var SettingsItem = require('./../../../shared/components/ios/SettingsItem.ios.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var ChatActions = require('./../../../chat/ChatActions');
var ChatStore = require('./../../../chat/ChatStore');
var CHAT = constants.CHAT;

var ThreadSettingsView = React.createClass({
  propTypes: {
    chatNavigator: React.PropTypes.object,
    activeThread: React.PropTypes.object,
    user: React.PropTypes.object
  },

  getInitialState() {
    return {
      threadName: ChatStore.getThreadName(this.props.activeThread._id)
    }
  },

  componentDidMount() {
    ChatStore.on(CHAT.SWITCH_TO_THREAD, this.onSwitchToThread);
  },
  componentWillUnmount() {
    ChatStore.off(CHAT.SWITCH_TO_THREAD, this.onSwitchToThread);
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

  goBack() {
    this.props.chatNavigator.pop();
  },

  editName() {
    AlertIOS.prompt(
      'Edit Thread Name',
      this.state.threadName,
      [{
        text: 'Save',
        onPress: this.saveName
      }, {
        text: 'Cancel',
        style: 'cancel'
      }]
    );
  },
  saveName(newName) {

  },

  leaveConversation() {
    ChatActions.removeUser(this.props.activeThread._id, this.props.user._id);
    // go back to tab bar
    this.props.chatNavigator.popToTop();
  },

  deleteConversation() {
    ChatActions.deleteThread(this.props.activeThread._id);
    // go back to tab bar
    this.props.chatNavigator.popToTop();
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

  submitEdit() {
    this.setState({
      editingName: false
    });
    ChatActions.editThread(this.props.activeThread._id, this.state.threadName);
  },

  addPeople() {
    this.props.chatNavigator.push(routes.CHAT.ADDPEOPLE);
  },

  _renderName() {
    return (
      <View style={ styles.header }>
        <ThreadImage
          thread={ this.props.activeThread }
          width={ 60 }
          height={ 60 }
        />
        <View style={ styles.headerDetails }>
          <Text style={ styles.threadName }>
            { this.state.threadName }
          </Text>
        </View>
      </View>
    );
  },

  _renderEditName() {
    if(this.props.activeThread.type != 'group')
      return <View/>;
    return (
      <SettingsItem
        icon={
          <Icon
            name='create'
            size={ 30 }
            color='#AAA'
          />
        }
        onPress={ this.editName }
        title='Change Name'
      />
    );
  },

  _renderAddPeople() {
    if(this.props.activeThread.type != 'bevy') {
      return (
        <SettingsItem
          icon={
            <Icon
              name='person-add'
              size={ 30 }
              color='#AAA'
            />
          }
          onPress={ this.addPeople }
          title='Add People'
        />
      );
    } else {
      return <View/>;
    }
  },

  _renderLeave() {
    if(this.props.activeThread.type == 'group') {
      return (
        <SettingsItem
          icon={
            <Icon
              name='exit-to-app'
              size={ 30 }
              color='#AAA'
            />
          }
          onPress={ this.leaveConversation }
          title='Leave Conversation'
        />
      );
    } else {
      return <View/>;
    }
  },

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.topBarContainer }>
          <View style={{
            height: constants.getStatusBarHeight(),
            backgroundColor: '#2CB673'
          }}/>
          <View style={ styles.topBar }>
            <TouchableOpacity
              activeOpacity={ 0.5 }
              style={ styles.iconButton }
              onPress={ this.goBack }
            >
              <Icon
                name='arrow-back'
                size={ 30 }
                color='#FFF'
              />
            </TouchableOpacity>
            <Text style={ styles.title }>
              Chat Settings
            </Text>
            <View style={{
              width: 48,
              height: 48
            }}/>
          </View>
        </View>
        <ScrollView style={ styles.contentContainer }>
          { this._renderName() }
          <Text style={ styles.sectionTitle }>
            {(this.props.activeThread.type == 'group') ? 'Settings' : ''}
          </Text>
          { this._renderEditName() }
          { this._renderLeave() }
          <Text style={ styles.sectionTitle }>
            People
          </Text>
          { this._renderAddPeople() }
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
  topBarContainer: {
    flexDirection: 'column',
    paddingTop: 0,
    overflow: 'visible',
    backgroundColor: '#2CB673'
  },
  topBar: {
    height: 48,
    backgroundColor: '#2CB673',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 17,
    textAlign: 'center',
    color: '#FFF'
  },
  iconButton: {
    width: 48,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  contentContainer: {
    flex: 1
  },
  header: {
    height: 80,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10
  },

  editHeader: {
    height: 80,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  headerDetails: {
    height: 48,
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 10
  },
  threadName: {
    color: '#000',
    fontSize: 17
  },
  sectionTitle: {
    color: '#AAA',
    fontSize: 17,
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
    fontSize: 17,
    marginLeft: 10
  },
  editInput: {
    borderRadius: 4,
    flex: 2,
    borderWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 10,
    paddingVertical: 5,
    height: 32,
    marginTop: 10
  },
  button: {
    borderRadius: 4,
    borderWidth: 1,
    margin: 5,
    paddingHorizontal: 5,
    paddingVertical: 5
  }
});

module.exports = ThreadSettingsView;

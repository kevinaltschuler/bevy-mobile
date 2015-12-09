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
  TouchableOpacity,
  TouchableHighlight
} = React;
var Icon = require('react-native-vector-icons/Ionicons');
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
    mainNavigator: React.PropTypes.object,
    activeThread: React.PropTypes.object,
    user: React.PropTypes.object
  },

  getInitialState() {
    return {
      editingName: false,
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
    this.props.mainNavigator.pop();
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

  submitEdit() {
    this.setState({
      editingName: false
    });
    ChatActions.editThread(this.props.activeThread._id, this.state.threadName);
  },

  addPeople() {
    this.props.mainNavigator.push(routes.CHAT.ADDPEOPLE);
  },

  _renderName() {
    if(this.state.editingName) {
      return (
        <View style={styles.editHeader}>
          <View style={{flexDirection: 'column', flex: 1, alignItems: 'flex-end'}}>
            <TextInput
              style={styles.editInput}
              defaultValue={ ChatStore.getThreadName(this.props.activeThread._id) }
              onSubmitEditing={this.submitEdit}
              onChangeText={(text) => {
                console.log(text);
                this.setState({
                  threadName: text
                })
              }}
            />
            <View style={{flexDirection: 'row'}}>
              <TouchableHighlight
                onPress={() => {
                  this.setState({
                    editingName: false
                  })
                }}
                underlayColor='rgba(0,0,0,.1)'
                style={[styles.button, {borderColor: '#999'}]}
              >
                <Text style={{color: '#999', fontWeight: 'bold'}}>
                  Cancel
                </Text>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={this.submitEdit}
                underlayColor='#2cb673'
                style={[styles.button, {borderColor: '#2cb673'}]}
              >
                <Text style={{color: '#2cb673', fontWeight: 'bold'}}>
                  Submit
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      )
    } else {
      return (
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
      )
    }
  },

  _renderEditName() {
    if(this.props.activeThread.type != 'group')
      return <View/>;
    return (
      <SettingsItem
        icon={<Icon
            name='edit'
            size={ 30 }
            color='#AAA'
          />}
        onPress={() => {
          this.setState({
            editingName: true
          })
        }}
        title='Change Name'
      />
    );
  },

  _renderAddPeople() {
    if(this.props.activeThread.type != 'bevy') {
      return (
        <SettingsItem
          icon={<Icon
              name='ios-personadd'
              size={ 30 }
              color='#AAA'
            />}
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
          icon={<Icon
              name='ios-undo'
              size={ 30 }
              color='#AAA'
            />}
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
  topBar: {
    width: constants.width,
    height: 48,
    backgroundColor: '#FFF',
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  backButton: {
    height: 48,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    color: '#000',
    textAlign: 'left',
    flex: 1
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
    color: '#000'
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

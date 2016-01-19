/**
 * NewThreadView.ios.js
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  ListView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var MessageInput = require('./MessageInput.ios.js');
var UserSearchItem = require('./../../../user/components/ios/UserSearchItem.ios.js');
var AddedUserItem = require('./../../../user/components/ios/AddedUserItem.ios.js');
var Spinner = require('react-native-spinkit');
var KeyboardEvents = require('react-native-keyboardevents');
var KeyboardEventEmitter = KeyboardEvents.Emitter;

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var ChatActions = require('./../../../chat/ChatActions');
var ChatStore = require('./../../../chat/ChatStore');
var UserActions = require('./../../../user/UserActions');
var UserStore = require('./../../../user/UserStore');
var USER = constants.USER;
var CHAT = constants.CHAT;

var NewThreadView = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    user: React.PropTypes.object,
    defaultUser: React.PropTypes.object
  },

  getInitialState() {
    var added = [];

    if(this.props.defaultUser != undefined){
      added.push(this.props.defaultUser);

    }
    else
      console.log('no default message receiver');

    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    return {
      toInput: '',
      searching: false,
      searchUsers: [],
      ds: ds.cloneWithRows([]),
      addedUsers: added,
      keyboardSpace: 0
    };
  },

  componentDidMount() {
    // listen to search events
    UserStore.on(USER.SEARCHING, this.onSearching);
    UserStore.on(USER.SEARCH_ERROR, this.onSearchError);
    UserStore.on(USER.SEARCH_COMPLETE, this.onSearchComplete);
    // populate list with random users for now
    UserActions.search('');

    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillShowEvent, this.onKeyboardShow);
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillHideEvent, this.onKeyboardHide);
  },
  componentWillUnmount() {
    UserStore.off(USER.SEARCHING, this.onSearching);
    UserStore.off(USER.SEARCH_ERROR, this.onSearchError);
    UserStore.off(USER.SEARCH_COMPLETE, this.onSearchComplete);

    KeyboardEventEmitter.off(KeyboardEvents.KeyboardWillShowEvent, this.onKeyboardShow);
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardWillHideEvent, this.onKeyboardHide);
  },

  onKeyboardShow(frames) {
    if(frames.end) {
      this.setState({ keyboardSpace: frames.end.height });
    } else {
      this.setState({ keyboardSpace: frames.endCoordinates.height });
    }
  },
  onKeyboardHide(frames) {
    this.setState({ keyboardSpace: 0 });
  },

  onSearching() {
    this.setState({ searching: true });
  },
  onSearchError() {
    this.setState({
      searching: false,
      searchUsers: []
    });
  },
  onSearchComplete() {
    var searchUsers = UserStore.getUserSearchResults();
    this.setState({
      searching: false,
      searchUsers: searchUsers,
      ds: this.state.ds.cloneWithRows(searchUsers)
    });
  },

  goBack() {
    this.props.mainNavigator.pop();
  },

  onSearchUserSelect(user) {
    var addedUsers = this.state.addedUsers;
    if(_.findWhere(this.state.addedUsers, { _id: user._id }) != undefined) {
      // user already exists
      // remove user from the list
      //addedUsers = _.reject(addedUsers, ($user) => $user._id == user._id);
    } else {
      // add user to list
      addedUsers.push(user);
      // clear text field
      this.setState({
        toInput: ''
      });
    }
    this.setState({
      addedUsers: addedUsers
    });
  },

  onChangeToText(text) {
    if(_.isEmpty(text) && _.isEmpty(this.state.toInput)) {
      // new and old text is empty
      // user probably pressed backspace on an empty field
      // so lets remove an added user if it exists
      var addedUsers = this.state.addedUsers;
      addedUsers.pop();
      this.setState({
        addedUsers: addedUsers
      });
      return;
    }

    // update state
    this.setState({
      toInput: text
    });
    // set search delay
    if(this.searchTimeout != undefined) {
      clearTimeout(this.searchTimeout);
      delete this.searchTimeout;
    }
    this.searchTimeout = setTimeout(this.search, 500);
  },

  search() {
    UserActions.search(this.state.toInput);
    this.setState({
      searching: true
    });
  },

  onRemoveAddedUser(user) {
    var addedUsers = this.state.addedUsers;
    addedUsers = _.reject(addedUsers, ($user) => $user._id == user._id);
    this.setState({
      addedUsers: addedUsers
    });
  },

  onSubmit(messageBody) {
    // dont allow for no added users
    if(_.isEmpty(this.state.addedUsers)) {
      return;
    }
    // dont allow for empty message
    if(_.isEmpty(messageBody)) {
      return;
    }
    // call action
    ChatActions.createThreadAndMessage(this.state.addedUsers, messageBody);
  },

  _renderAddedUsers() {
    console.log(this.state.addedUsers);
    var users = [];
    for(var key in this.state.addedUsers) {
      var addedUser = this.state.addedUsers[key];
      // dont render self
      if(addedUser._id == this.props.user._id) continue;

      users.push(
        <AddedUserItem
          key={ 'addeduser:' + addedUser._id }
          user={ addedUser }
          onRemove={ this.onRemoveAddedUser }
        />
      );
    }
    return users;
  },

  _renderSearchUsers() {
    if(this.state.searching) {
      return (
        <View style={ styles.progressContainer }>
          <Spinner
            isVisible={true}
            size={40}
            type={'Arc'}
            color={'#2cb673'}
          />
        </View>
      );
    } else if(!this.state.searching && _.isEmpty(this.state.searchUsers)) {
      return (
        <View style={ styles.progressContainer }>
          <Text style={ styles.noneFoundText }>
            No Users Found
          </Text>
        </View>
      );
    } else return (
      <ListView
        style={ styles.userList }
        dataSource={ this.state.ds }
        scrollRenderAheadDistance={ 300 }
        removeClippedSubviews={ true }
        automaticallyAdjustContentInsets={ false }
        initialListSize={ 10 }
        pageSize={ 10 }
        renderRow={ user => {
          return (
            <UserSearchItem
              key={ 'searchuser:' + user._id }
              user={ user }
              onSelect={ this.onSearchUserSelect }
              selected={
                _.findWhere(this.state.addedUsers, { _id: user._id }) != undefined
              }
            />
          );
        }}
      />
    );
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
              New Chat
            </Text>
          </View>
        </View>
        <View style={ styles.toBar }>
          <Text style={ styles.toText }>
            To:
          </Text>
          { this._renderAddedUsers() }
          <TextInput
            ref='ToInput'
            autoCorrect={ false }
            autoCapitalize={ 'none' }
            style={ styles.toInput }
            value={ this.state.toInput }
            onChangeText={ this.onChangeToText }
            onSubmitEditing={ this.onSubmitToEditing }
            placeholder='Search For Users'
            placeholderTextColor='#CCC'
          />
        </View>
        { this._renderSearchUsers() }
        <MessageInput
          marginBottom={ this.state.keyboardSpace }
          onSubmitEditing={ this.onSubmit }
        />
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
    color: '#FFF',
    paddingRight: 40
  },
  iconButton: {
    width: 48,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  toBar: {
    width: constants.width,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    flexWrap: 'wrap',
    paddingTop: 6,
    paddingHorizontal: 10
  },
  toText: {
    color: '#AAA',
    fontSize: 17,
    marginRight: 10,
    marginBottom: 3
  },
  toInput: {
    flex: 1,
    height: 50,
    fontSize: 17
  },
  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  noneFoundText: {
    color: '#AAA',
    fontSize: 22
  },
  userList: {
    flex: 1,
  }
});

module.exports = NewThreadView;

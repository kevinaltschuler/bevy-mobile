/**
 * AddPeopleView.ios.js
 * @author kevin
 * algo sux
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
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/Ionicons');
//var MessageInput = require('./MessageInput.ios.js');
var UserSearchItem = require('./UserSearchItem.ios.js');
var AddedUserItem = require('./UserItem.ios.js');
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

var AddPeopleView = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    activeThread: React.PropTypes.object,
    user: React.PropTypes.object
  },

  getInitialState() {
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => true });
    return {
      toInput: '',
      searching: false,
      searchUsers: [],
      ds: ds.cloneWithRows([]),
      addedUsers: [],
      keyboardSpace: 48
    };
  },

  componentDidMount() {
    // listen to search events
    UserStore.on(USER.SEARCHING, this.onSearching);
    UserStore.on(USER.SEARCH_ERROR, this.onSearchError);
    UserStore.on(USER.SEARCH_COMPLETE, this.onSearchComplete);
    // listen to chat store events
    ChatStore.on(CHAT.SWITCH_TO_THREAD, this.onSwitchToThread);
    // populate list with random users for now
    UserActions.search('');
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillShowEvent, (frames) => {

      console.log(frames);

      if (frames.end) {
        this.setState({keyboardSpace: frames.end.height});
      } else {
        this.setState({keyboardSpace: frames.endCoordinates.height});
      }
    });
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillHideEvent, (frames) => {
      this.setState({
        keyboardSpace: 48
      });
    });
  },

  componentWillUnmount() {
    UserStore.off(USER.SEARCHING, this.onSearching);
    UserStore.off(USER.SEARCH_ERROR, this.onSearchError);
    UserStore.off(USER.SEARCH_COMPLETE, this.onSearchComplete);
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardWillShowEvent, (frames) => {

      if (frames.end) {
        this.setState({keyboardSpace: frames.end.height});
      } else {
        this.setState({keyboardSpace: frames.endCoordinates.height});
      }
    });
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardWillHideEvent, (frames) => {
      this.setState({
        keyboardSpace: 48
      });
    });
  },

  onSearching() {
    this.setState({
      searching: true
    });
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

  onSwitchToThread(thread_id) {
    // go to thread view
    this.props.mainNavigator.replace(routes.CHAT.CHATVIEW);
  },

  onBackButton() {
    if(!_.isEmpty(this.state.addedUsers)) {
      // if theres added users, use back button to pop them
      var addedUsers = this.state.addedUsers;
      addedUsers.pop();
      this.setState({
        addedUsers: addedUsers
      });
      return true;
    }

    // nothing else to do, go back
    this.props.mainNavigator.pop();
    return true;
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

  submit() {
    // dont allow for no added users
    if(_.isEmpty(this.state.addedUsers)) {
      return;
    }
    // call action
    ChatActions.addUsers(this.props.activeThread._id, this.state.addedUsers);
    this.props.chatNavigator.pop();
  },

  _renderAddedUsers() {
    var users = [];
    for(var key in this.state.addedUsers) {
      var addedUser = this.state.addedUsers[key];
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
        initialListSize={ 10 }
        pageSize={ 10 }
        renderRow={(user) => {
          return (
            <UserSearchItem
              key={ 'searchuser:' + user._id }
              searchUser={ user }
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
        { this._renderSearchUsers() }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE'
  },
  navBar: {
    height: 48,
    width: constants.width,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderBottomColor: '#DDD',
    borderBottomWidth: 1
  },
  backButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  title: {
    flex: 1,
    color: '#000'
  },
  tabBar: {
    width: constants.width,
    backgroundColor: 'rgba(0,0,0,.1)',
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
    marginRight: 10,
    marginBottom: 6
  },
  toInput: {
    flex: 1,
    height: 36
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

module.exports = AddPeopleView;

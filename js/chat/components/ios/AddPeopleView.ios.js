/**
 * AddPeopleView.ios.js
 * @author kevin
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  ListView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  DeviceEventEmitter,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var UserSearchItem = require('./../../../user/components/ios/UserSearchItem.ios.js');
var AddedUserItem = require('./../../../user/components/ios/AddedUserItem.ios.js');
var Spinner = require('react-native-spinkit');

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
    chatNavigator: React.PropTypes.object,
    activeThread: React.PropTypes.object,
    user: React.PropTypes.object
  },

  getInitialState() {
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    return {
      toInput: '',
      searching: true,
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
    // populate list with random users for now
    UserActions.search('');

    DeviceEventEmitter.addListener('keyboardDidShow', this.onKeyboardShow);
    DeviceEventEmitter.addListener('keyboardWillHide', this.onKeyboardHide);
  },

  componentWillUnmount() {
    UserStore.off(USER.SEARCHING, this.onSearching);
    UserStore.off(USER.SEARCH_ERROR, this.onSearchError);
    UserStore.off(USER.SEARCH_COMPLETE, this.onSearchComplete);
  },

  onKeyboardShow(frames) {
    if (frames.end) {
      this.setState({ keyboardSpace: frames.end.height });
    } else {
      this.setState({ keyboardSpace: frames.endCoordinates.height });
    }
  },
  onKeyboardHide(frames) {
    this.setState({ keyboardSpace: 48 });
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
    searchUsers = _.reject(searchUsers, user => {
      if(user._id == this.props.user._id) return true;
      return (_.contains(_.pluck(this.props.activeThread.users, '_id'), user._id));
    });
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

  submit() {
    // dont allow for no added users
    if(_.isEmpty(this.state.addedUsers)) return;
    // call action
    ChatActions.addUsers(this.props.activeThread._id, this.state.addedUsers);
    // go back to settings view
    this.props.mainNavigator.pop();
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

  _renderLoading() {
    if(!this.state.searching) return <View />;
    return (
      <View style={ styles.progressContainer }>
        <Spinner
          isVisible={ true }
          size={ 40 }
          type={ 'Arc' }
          color={ '#2CB673' }
        />
      </View>
    );
  },

  _renderNoneFound() {
    if(!this.state.searching && _.isEmpty(this.state.searchUsers)) {
      return (
        <View style={ styles.progressContainer }>
          <Text style={ styles.noneFoundText }>
            No Users Found
          </Text>
        </View>
      );
    }
    return <View />;
  },

  _renderSearchUsers() {
    if(this.state.searching) return <View />;
    // use scrollview here because for some reason listview likes to break

    var users = [];
    for(var key in this.state.searchUsers) {
      var user = this.state.searchUsers[key];
      users.push(
        <UserSearchItem
          key={ 'searchuser:' + user._id }
          user={ user }
          onSelect={ this.onSearchUserSelect }
          selected={
            _.findWhere(this.state.addedUsers, { _id: user._id }) != undefined
          }
        />
      );
    }
    return (
      <ScrollView>
        { users }
      </ScrollView>
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
              Add People To This Chat
            </Text>
            <TouchableOpacity
              activeOpacity={ 0.5 }
              style={ styles.iconButton }
              onPress={ this.submit }
            >
              <Icon
                name='done'
                size={ 30 }
                color='#FFF'
              />
            </TouchableOpacity>
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
            placeholder=''
            placeholderTextColor='#AAA'
          />
        </View>
        { this._renderLoading() }
        { this._renderNoneFound() }
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
    marginBottom: 6
  },
  toInput: {
    flex: 1,
    height: 48,
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

module.exports = AddPeopleView;

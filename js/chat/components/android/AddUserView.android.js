/**
 * AddUserView.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Image,
  Text,
  TextInput,
  ListView,
  TouchableNativeFeedback,
  ProgressBarAndroid,
  BackAndroid,
  StyleSheet
} = React;
var Icon = require('./../../../shared/components/android/Icon.android.js');
var UserSearchItem = require('./../../../user/components/android/UserSearchItem.android.js');
var AddedUserItem = require('./../../../user/components/android/AddedUserItem.android.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var ChatActions = require('./../../../chat/ChatActions');
var ChatStore = require('./../../../chat/ChatStore');
var UserActions = require('./../../../user/UserActions');
var UserStore = require('./../../../user/UserStore');
var USER = constants.USER;
var CHAT = constants.CHAT;

var AddUserView = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    activeThread: React.PropTypes.object,
    user: React.PropTypes.object
  },

  getInitialState() {
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => true });
    return {
      input: '',
      searching: false,
      searchUsers: [],
      addedUsers: [],
      ds: ds.cloneWithRows([])
    };
  },

  componentDidMount() {
    // listen to search events
    UserStore.on(USER.SEARCHING, this.onSearching);
    UserStore.on(USER.SEARCH_ERROR, this.onSearchError);
    UserStore.on(USER.SEARCH_COMPLETE, this.onSearchComplete);
    // listen to back button
    BackAndroid.addEventListener('hardwareBackPress', this.onBackButton);
    // populate list with random users for now
    UserActions.search('');
  },
  componentWillUnmount() {
    UserStore.off(USER.SEARCHING, this.onSearching);
    UserStore.off(USER.SEARCH_ERROR, this.onSearchError);
    UserStore.off(USER.SEARCH_COMPLETE, this.onSearchComplete);
    BackAndroid.removeEventListener('hardwareBackPress', this.onBackButton);
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
    // reject all users that are already in the thread
    // TODO: to this through a query and server processing instead.
    // this can potentially lead to no users being found even when
    // they exist do to fetching restrictions in the API
    searchUsers = _.reject(searchUsers, user => {
      return _.contains(_.pluck(this.props.activeThread.users, '_id'), user._id);
    });
    this.setState({
      searching: false,
      searchUsers: searchUsers,
      ds: this.state.ds.cloneWithRows(searchUsers)
    });
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

  onChangeText(text) {
    if(_.isEmpty(text) && _.isEmpty(this.state.input)) {
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
      input: text
    });
    // set search delay
    if(this.searchTimeout != undefined) {
      clearTimeout(this.searchTimeout);
      delete this.searchTimeout;
    }
    this.searchTimeout = setTimeout(this.search, 500);
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
        input: ''
      });
    }
    this.setState({
      addedUsers: addedUsers
    });
  },

  onRemoveAddedUser(user) {
    var addedUsers = this.state.addedUsers;
    addedUsers = _.reject(addedUsers, ($user) => $user._id == user._id);
    this.setState({
      addedUsers: addedUsers
    });
  },

  search() {
    UserActions.search(this.state.input);
    this.setState({
      searching: true
    });
  },

  goBack() {
    this.props.mainNavigator.pop();
  },

  onComplete() {
    ChatActions.addUsers(this.props.activeThread._id, this.state.addedUsers);
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

  _renderSearchUsers() {
    if(this.state.searching) {
      return (
        <View style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <ProgressBarAndroid/>
        </View>
      );
    } else if(!this.state.searching && _.isEmpty(this.state.searchUsers)) {
      return (
        <View style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={{
            color: '#AAA',
            fontSize: 22
          }}>
            No Users Found
          </Text>
        </View>
      );
    } else return (
      <ListView
        style={{
          flex: 1
        }}
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
        <View style={ styles.topBar }>
          <TouchableNativeFeedback
            onPress={ this.goBack }
          >
            <View style={{
              height: 48,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 8,
              marginRight: 8
            }}>
              <Icon
                name='arrow-back'
                color='#FFF'
                size={ 30 }
              />
            </View>
          </TouchableNativeFeedback>
          <Text style={{
            flex: 1,
            color: '#FFF',
            fontSize: 18
          }}>
            Add Users to { ChatStore.getThreadName(this.props.activeThread._id) }
          </Text>
          <TouchableNativeFeedback
            onPress={ this.onComplete }
          >
            <View style={{
              height: 48,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 8,
              marginLeft: 8
            }}>
              <Text style={{
                color: '#FFF'
              }}>
                Done
              </Text>
            </View>
          </TouchableNativeFeedback>
        </View>
        <View style={ styles.toBar }>
          <Text style={ styles.toText }>
            To:
          </Text>
          { this._renderAddedUsers() }
          <TextInput
            ref={ref => { this.input = ref; }}
            style={ styles.toInput }
            value={ this.state.input }
            onChangeText={ this.onChangeText }
            onSubmitEditing={ this.onSubmitEditing }
            placeholder=''
            placeholderTextColor='#AAA'
            underlineColorAndroid='#FFF'
          />
        </View>
        { this._renderSearchUsers() }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE',
    flexDirection: 'column'
  },
  topBar: {
    width: constants.width,
    height: 48,
    backgroundColor: '#2CB673',
    flexDirection: 'row',
    alignItems: 'center'
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
    marginRight: 10,
    marginBottom: 6
  },
  toInput: {
    flex: 1,
    height: 36
  },
});

module.exports = AddUserView;

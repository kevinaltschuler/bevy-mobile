/**
 * NewThreadView.android.js
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  ListView,
  Text,
  TextInput,
  TouchableNativeFeedback,
  ProgressBarAndroid,
  BackAndroid,
  ToastAndroid,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var MessageInput = require('./MessageInput.android.js');
var UserSearchItem = require('./../../../user/components/android/UserSearchItem.android.js');
var AddedUserItem = require('./../../../user/components/android/AddedUserItem.android.js');

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
    mainNavigator: React.PropTypes.object
  },

  getInitialState() {
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => true });
    return {
      toInput: '',
      searching: false,
      searchUsers: [],
      ds: ds.cloneWithRows([]),
      addedUsers: []
    };
  },

  componentDidMount() {
    // listen to search events
    UserStore.on(USER.SEARCHING, this.onSearching);
    UserStore.on(USER.SEARCH_ERROR, this.onSearchError);
    UserStore.on(USER.SEARCH_COMPLETE, this.onSearchComplete);
    // listen to chat store events
    ChatStore.on(CHAT.SWITCH_TO_THREAD, this.onSwitchToThread);
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
    this.setState({
      searching: false,
      searchUsers: searchUsers,
      ds: this.state.ds.cloneWithRows(searchUsers)
    });
  },

  onSwitchToThread(thread_id) {
    // go to thread view
    this.props.mainNavigator.replace(routes.MAIN.MESSAGEVIEW);
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

  onSubmit(messageBody) {
    // dont allow for no added users
    if(_.isEmpty(this.state.addedUsers)) {
      ToastAndroid.show('Please Add A User To Send This Message To', ToastAndroid.SHORT);
      return;
    }
    // dont allow for empty message
    if(_.isEmpty(messageBody)) {
      ToastAndroid.show('Please Enter A Message To Send', ToastAndroid.SHORT);
      return;
    }
    // call action
    ChatActions.createThreadAndMessage(this.state.addedUsers, messageBody);
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
          <ProgressBarAndroid/>
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
        <View style={ styles.navBar }>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#DDD', false) }
            onPress={ this.goBack }
          >
            <View style={ styles.backButton }>
              <Icon
                name='arrow-back'
                size={ 30 }
                color='#888'
              />
            </View>
          </TouchableNativeFeedback>
          <Text style={ styles.title }>
            New Message
          </Text>
        </View>
        <View style={ styles.toBar }>
          <Text style={ styles.toText }>
            To:
          </Text>
          { this._renderAddedUsers() }
          <TextInput
            ref='ToInput'
            style={ styles.toInput }
            value={ this.state.toInput }
            onChangeText={ this.onChangeToText }
            onSubmitEditing={ this.onSubmitToEditing }
            placeholder=''
            placeholderTextColor='#AAA'
            underlineColorAndroid='#FFF'
          />
        </View>
        { this._renderSearchUsers() }
        <MessageInput
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
    flex: 1
  }
});

module.exports = NewThreadView;
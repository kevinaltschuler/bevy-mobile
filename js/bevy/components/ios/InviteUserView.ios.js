/**
 * InviteUserView.ios.js
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
  StyleSheet,
  DeviceEventEmitter,
  ScrollView
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var UserSearchItem = require('./../../../user/components/ios/UserSearchItem.ios.js');
var InviteItem = require('./InviteItem.ios.js');
var Spinner = require('react-native-spinkit');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var ChatActions = require('./../../../chat/ChatActions');
var ChatStore = require('./../../../chat/ChatStore');
var UserActions = require('./../../../user/UserActions');
var UserStore = require('./../../../user/UserStore');
var BevyActions = require('./../../BevyActions');
var USER = constants.USER;
var CHAT = constants.CHAT;

var InviteUserView = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    chatNavigator: React.PropTypes.object,
    activeBevy: React.PropTypes.object,
    user: React.PropTypes.object
  },

  getInitialState() {
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => true });
    return {
      toInput: '',
      searching: false,
      searchUsers: [],
      ds: ds.cloneWithRows([]),
      keyboardSpace: 48
    };
  },

  componentDidMount() {
    // listen to search events
    UserStore.on(USER.SEARCHING, this.onSearching);
    UserStore.on(USER.SEARCH_ERROR, this.onSearchError);
    UserStore.on(USER.SEARCH_COMPLETE, this.onSearchComplete);

    DeviceEventEmitter.addListener('keyboardDidShow', this.onKeyboardShow);
    DeviceEventEmitter.addListener('keyboardWillHide', this.onKeyboardHide);

    // populate list with random users for now
    UserActions.search('');
  },

  componentWillUnmount() {
    UserStore.off(USER.SEARCHING, this.onSearching);
    UserStore.off(USER.SEARCH_ERROR, this.onSearchError);
    UserStore.off(USER.SEARCH_COMPLETE, this.onSearchComplete);
  },

  onKeyboardShow(frames) {
    if (frames.end) {
      this.setState({keyboardSpace: frames.end.height});
    } else {
      this.setState({keyboardSpace: frames.endCoordinates.height});
    }
  },
  onKeyboardHide(frames) {
    this.setState({ keyboardSpace: 48 });
  },

  onSearching() {
    console.log('searching');
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

  goBack() {
    this.props.mainNavigator.pop();
  },

  onSearchUserSelect(user) {
    BevyActions.inviteUser(user);
    var filteredUsers = _.reject(this.state.searchUsers, function($user){ return $user._id == user._id});
    this.setState({
      searchUsers: filteredUsers
    })
  },

  onChangeToText(text) {
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

  _renderPendingInvites() {
    var users = [];
    var invites = this.props.bevyInvites;
    for(var key in invites) {
      var invite = invites[key];
      if(invite.requestType == 'invite')
        users.push(
          <InviteItem
            key={ 'invite:' + invite._id }
            invite={ invite }
          />
        );
    }
    if(_.isEmpty(users)) {
      return <View/>;
    }
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Pending Invitations
        </Text>
        { users }
      </View>
    );
  },

  _renderPendingRequests() {
    var users = [];
    var invites = this.props.bevyInvites
    for(var key in invites) {
      var invite = invites[key];
      if(invite.requestType == 'request_join')
        users.push(
          <InviteItem
            key={ 'invite:' + invite._id }
            invite={ invite }
          />
        );
    }
    if(_.isEmpty(users)) {
      return <View/>;
    }
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Pending Requests
        </Text>
        { users }
      </View>
    );
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
          var invites = this.props.bevyInvites;
          for(var key in invites) {
            if ((user._id) == invites[key].user._id)
              return <View/>;
          }
          return (
            <UserSearchItem
              key={ 'searchuser:' + user._id }
              user={ user }
              onSelect={ this.onSearchUserSelect }
            />
          );
        }}
      />
    );
  },

  render() {
    var bevy = this.props.activeBevy;
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
              Invite a user to { bevy.name }
            </Text>
            <View style={{height: 30, width: 30}}/>
          </View>
        </View>
        <ScrollView
          style={{
            flex: 1,
            paddingTop: 15
          }}
        >
          { this._renderPendingRequests() }
          { this._renderPendingInvites() }
          <Text style={styles.sectionTitle}>
            Search For Users
          </Text>
          <View style={ styles.toBar }>
            <TextInput
              ref='ToInput'
              style={ styles.toInput }
              value={ this.state.toInput }
              onChangeText={ this.onChangeToText }
              placeholder=''
              placeholderTextColor='#AAA'
              underlineColorAndroid='#FFF'
            />
          </View>
          { this._renderSearchUsers() }
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
    alignItems: 'center',
    marginTop: 50
  },
  noneFoundText: {
    color: '#AAA',
    fontSize: 22
  },
  userList: {
    flex: 1,
  },
  section: {
    paddingVertical: 10,
  },
  sectionTitle: {
    color: '#888',
    fontSize: 15,
    marginLeft: 10,
    marginBottom: 5
  },
});

module.exports = InviteUserView;

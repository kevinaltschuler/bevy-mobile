/**
 * InviteUserView.ios.js
 *
 * View to invite users to a bevy/board (only bevy for now)
 *
 * @author kevin
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
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  DeviceEventEmitter,
  RefreshControl,
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
      query: '',
      searching: false,
      searchingInitial: true,
      searchUsers: [],
      ds: ds.cloneWithRows([]),
      keyboardSpace: 0,
      invites: this.props.bevyInvites
    };
  },

  componentDidMount() {
    // listen to search events
    UserStore.on(USER.SEARCHING, this.onSearching);
    UserStore.on(USER.SEARCH_ERROR, this.onSearchError);
    UserStore.on(USER.SEARCH_COMPLETE, this.onSearchComplete);

    this.keyboardWillShowSub = DeviceEventEmitter.addListener('keyboardDidShow', this.onKeyboardShow);
    this.keyboardWillHideSub = DeviceEventEmitter.addListener('keyboardWillHide', this.onKeyboardHide);

    // populate list with random users for now
    UserActions.search('');
  },

  componentWillUnmount() {
    UserStore.off(USER.SEARCHING, this.onSearching);
    UserStore.off(USER.SEARCH_ERROR, this.onSearchError);
    UserStore.off(USER.SEARCH_COMPLETE, this.onSearchComplete);

    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  },

  onKeyboardShow(frames) {
    if (frames.end) {
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
      searchingInitial: false,
      searchUsers: searchUsers,
      ds: this.state.ds.cloneWithRows(searchUsers)
    });
  },

  goBack() {
    this.props.mainNavigator.pop();
  },

  onSearchUserSelect(user) {
    BevyActions.inviteUser(user);
    UserActions.search(this.state.query);
  },

  onChangeToText(text) {
    // update state
    this.setState({ query: text });
    // set search delay
    if(this.searchTimeout != undefined) {
      clearTimeout(this.searchTimeout);
      delete this.searchTimeout;
    }
    this.searchTimeout = setTimeout(this.search, 500);
  },

  search() {
    UserActions.search(this.state.query);
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
      <View style={ styles.section }>
        <Text style={ styles.sectionTitle }>
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
    if(this.state.searchingInitial) {
      return (
        <View style={ styles.progressContainer }>
          <Spinner
            isVisible={ true }
            size={ 40 }
            type={ '9CubeGrid' }
            color={ '#2cb673' }
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
        ref={ ref => { this.UserList = ref; }}
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
            <Text
              style={ styles.title }
              numberOfLines={ 1 }
            >
              Invite a user to { bevy.name }
            </Text>
            <View style={{ height: 48, width: 48 }}/>
          </View>
        </View>
        <ScrollView
          style={[ styles.body, {
            marginBottom: this.state.keyboardSpace
          }]}
          automaticallyAdjustContentInsets={ false }
          refreshControl={
            <RefreshControl
              refreshing={ this.state.searching }
              onRefresh={ this.search }
              tintColor='#AAA'
              title='Loading...'
            />
          }
        >
          { this._renderPendingRequests() }
          { this._renderPendingInvites() }
          <View style={ styles.searchBar }>
            <Icon
              name='search'
              size={ 24 }
              color='#AAA'
            />
            <TextInput
              ref={ ref => { this.SearchBar = ref; }}
              style={ styles.searchInput }
              value={ this.state.query }
              onChangeText={ this.onChangeToText }
              placeholder='Search for users'
              placeholderTextColor='#AAA'
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
    color: '#FFF',
    marginHorizontal: 10
  },
  iconButton: {
    width: 48,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  body: {
    flex: 1
  },
  searchBar: {
    width: constants.width,
    height: 48,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DDD',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    marginTop: 8
  },
  searchInput: {
    flex: 1,
    height: 48,
    marginLeft: 10
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
    color: '#AAA',
    fontSize: 15,
    marginLeft: 10,
    marginBottom: 5
  },
});

module.exports = InviteUserView;

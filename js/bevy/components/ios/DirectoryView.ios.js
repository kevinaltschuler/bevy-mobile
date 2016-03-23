/**
 * DirectoryView.ios.js
 *
 * View for searching through the users of a bevy
 *
 * @author albert
 * @author kevin
 * @author ben
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  TouchableHighlight,
  TouchableOpacity,
  SwitchIOS,
  TabBarIOS,
  ScrollView,
  TextInput,
  RefreshControl,
  DeviceEventEmitter,
  SegmentedControlIOS
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var UserSearchItem = require('./../../../user/components/ios/UserSearchItem.ios.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var BevyActions = require('./../../../bevy/BevyActions');
var UserActions = require('./../../../user/UserActions');
var BevyStore = require('./../../../bevy/BevyStore');
var UserStore = require('./../../../user/UserStore');

var USER = constants.USER;

var DirectoryView = React.createClass({
  propTypes: {
  },

  //active Tab index: 0: users, 1: admins
  getInitialState() {
    var users = UserStore.getUserSearchResults();
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    return {
      ds: ds.cloneWithRows(users),
      users: users,
      query: '',
      fetching: true,
      keyboardSpace: 0,
      activeTab: 0
    };
  },

  componentDidMount() {
    UserStore.on(USER.SEARCHING, this.onUserSearching);
    UserStore.on(USER.SEARCH_ERROR, this.onUserSearchError);
    UserStore.on(USER.SEARCH_COMPLETE, this.onUserSearchComplete);

    this.keyboardWillShowSub = DeviceEventEmitter.addListener('keyboardDidShow', this.onKeyboardShow);
    this.keyboardWillHideSub = DeviceEventEmitter.addListener('keyboardWillHide', this.onKeyboardHide);

    setTimeout(this.search, 250);
  },

  componentWillUnmount() {
    UserStore.off(USER.SEARCHING, this.onUserSearching);
    UserStore.off(USER.SEARCH_ERROR, this.onUserSearchError);
    UserStore.off(USER.SEARCH_COMPLETE, this.onUserSearchComplete);

    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  },

  onUserSearching() {
    this.setState({ fetching: true });
  },
  onUserSearchError() {
    this.setState({ fetching: false });
  },
  onUserSearchComplete() {
    var users = UserStore.getUserSearchResults();
    setTimeout(() => {
      this.setState({
        fetching: false,
        ds: this.state.ds.cloneWithRows(users),
        users: users
      });
    }, 250);
  },

  goBack() {
    this.props.mainNavigator.pop();
  },

  switchTab(tab) {
    var data, index;
    switch(tab) {
      // switch to admin search
      case 'Admins':
        data = this.state.users;
        index = 1;
        break;
      // switch to user search
      case 'Users':
        data = this.state.users;
        index = 0;
        break;
      default:
        data = [];
        index = 0;
        break;
    }
    this.setState({
      ds: this.state.ds.cloneWithRows(data),
      activeTab: index
    });
    setTimeout(this.search, 250);
  },

  onKeyboardShow(ev) {
    var height = (ev.end) ? ev.end.height : ev.endCoordinates.height;
    this.setState({ keyboardSpace: height });
  },
  onKeyboardHide(ev) {
    this.setState({ keyboardSpace: 0 });
  },

  onRefresh() {
    this.search();
  },

  goToProfileView(user) {
    var route = {
      name: routes.MAIN.PROFILE,
      profileUser: user
    };
    this.props.mainNavigator.push(route);
  },

  search() {
    var role = (this.state.activeTab == 0) ? 'user' : 'admin';
    UserActions.search(this.state.query, this.props.activeBevy._id, role);
  },

  onChangeText(query) {
    this.setState({ query: query });
    if(this.searchTimeout != undefined) {
      clearTimeout(this.searchTimeout);
      delete this.searchTimeout;
    }
    this.searchTimeout = setTimeout(this.search, 300);
  },

  renderRow(payload) {
    if(this.state.loadingInitial) return <View />;
    return (
      <UserSearchItem
        key={ 'usersearchitem' + payload._id }
        user={ payload }
        showIcon={ false }
        onSelect={ this.goToProfileView }
      />
    );
  },

  renderHeader() {
    return (
      <View>
        { this.renderNoneFound() }
      </View>
    );
  },

  renderNoneFound() {
    if(this.state.loadingInitial || this.state.fetching) {
      return <View />;
    }
    if(!_.isEmpty(this.state.query) && this.state.ds.getRowCount() <= 0) {
      // user searched for something and no results came up
      // render 'none found' text
      return (
        <View style={ styles.noneFoundContainer }>
          <Text style={ styles.noneFoundText }>
            { 'No Users found' }
          </Text>
        </View>
      );
    }
    return <View />;
  },

  render() {
    return (
      <View style={[ styles.container, {
        marginBottom: this.state.keyboardSpace
      }]}>
        <View style={ styles.statusBar }>
          <View style={{
            height: constants.getStatusBarHeight(),
            backgroundColor: '#2CB673'
          }}/>
        </View>

        <View style={ styles.topBar }>
          <TouchableOpacity
            activeOpacity={ 0.5 }
            onPress={ this.goBack }
            style={ styles.iconButton }
          >
            <Icon
              name='arrow-back'
              size={ 30 }
              color='#FFF'
            />
          </TouchableOpacity>
          <Text style={ styles.title }>
            Bevy Directory
          </Text>
          <View style={{ width: 48, height: 48 }} />
        </View>

        <View style={ styles.tabBar }>
          <SegmentedControlIOS
            style={ styles.segmentedControl }
            tintColor='#fff'
            values={['Users', 'Admins']}
            selectedIndex={ this.state.activeTab }
            onValueChange={ this.switchTab }
          />
        </View>

        <View style={ styles.searchBox }>
          <Icon
            name='search'
            size={ 24 }
            color='#FFF'
            style={ styles.searchIcon }
          />
          <TextInput
            ref={ ref => { this.SearchInput = ref; }}
            style={ styles.searchInput }
            placeholderTextColor='rgba(255,255,255,.6)'
            clearButtonMode='always'
            onChangeText={ this.onChangeText }
            onSubmitEditing={ this.search }
            value={ this.state.query }
            placeholder='Search'
            returnKeyType='search'
            blurOnSubmit={ true }
          />
        </View>
        <ListView
          ref={ ref => { this.SearchList = ref; }}
          style={ styles.searchList }
          contentContainerStyle={ styles.searchListInnerContainer }
          dataSource={ this.state.ds }
          automaticallyAdjustContentInsets={ false }
          keyboardShouldPersistTaps={ true }
          keyboardDismissMode='on-drag'
          refreshControl={
            <RefreshControl
              refreshing={ this.state.fetching }
              onRefresh={ this.onRefresh }
              tintColor='#AAA'
            />
          }
          renderHeader={ this.renderHeader }
          renderRow={ this.renderRow }
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 0,
    backgroundColor: '#2CB673',
  },
  statusBar: {
    flexDirection: 'column',
    paddingTop: 0,
    overflow: 'visible',
    backgroundColor: '#2CB673',
  },
  topBar: {
    width: constants.width,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2CB673',
  },
  title: {
    flex: 1,
    fontSize: 17,
    color: '#FFF',
    textAlign: 'center'
  },
  iconButton: {
    width: 48,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

  tabBar: {
    width: constants.width,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2CB673',
  },
  segmentedControl: {
    backgroundColor: '#2CB673',
    marginBottom: 7,
    marginHorizontal: 10,
    flex: 1
  },

  searchBox: {
    backgroundColor: 'rgba(255,255,255,.3)',
    flexDirection: 'row',
    height: 36,
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 4,
    marginHorizontal: 10,
    marginBottom: 6
  },
  searchIcon: {

  },
  searchInput: {
    flex: 1,
    height: 36,
    paddingHorizontal: 10,
    color: '#fff'
  },

  searchList: {
    flex: 1,
    backgroundColor: '#EEE'
  },
  searchListInnerContainer: {
    flexDirection: 'column',
    width: constants.width,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 50
  },
  noneFoundContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  noneFoundText: {
    color: '#AAA',
    fontSize: 22,
    marginVertical: 50
  },
  loadingContainer: {
    flex: 1,
    marginVertical: 50
  }
});

module.exports = DirectoryView;

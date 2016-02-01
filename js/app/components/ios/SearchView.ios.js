/**
 * SearchView.ios.js
 *
 * View for searching bevies and users
 * TODO: search for other stuff
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
var BevyCard = require('./../../../bevy/components/ios/BevyCard.ios.js');
var BevySearchItem = require('./../../../bevy/components/ios/BevySearchItem.ios.js');
var UserSearchItem = require('./../../../user/components/ios/UserSearchItem.ios.js');
var Spinner = require('react-native-spinkit');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var BevyActions = require('./../../../bevy/BevyActions');
var UserActions = require('./../../../user/UserActions');
var BevyStore = require('./../../../bevy/BevyStore');
var UserStore = require('./../../../user/UserStore');

var BEVY = constants.BEVY;
var USER = constants.USER;

// search tabs
// 0 - bevies
// 1 - users

var SearchView = React.createClass({
  propTypes: {
    searchRoute: React.PropTypes.object,
    searchNavigator: React.PropTypes.object,
  },

  getInitialState() {
    var bevies = BevyStore.getSearchList();
    var users = UserStore.getUserSearchResults();
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    return {
      ds: ds.cloneWithRows(bevies),
      users: users,
      bevies: bevies,
      query: '',
      fetching: false,
      loadingInitial: true,
      activeTab: 0,
      keyboardSpace: 0
    };
  },

  componentDidMount() {
    BevyStore.on(BEVY.SEARCHING, this.onBevySearching);
    BevyStore.on(BEVY.SEARCH_COMPLETE, this.onBevySearchComplete);

    UserStore.on(USER.SEARCHING, this.onUserSearching);
    UserStore.on(USER.SEARCH_ERROR, this.onUserSearchError);
    UserStore.on(USER.SEARCH_COMPLETE, this.onUserSearchComplete);

    this.keyboardWillShowSub = DeviceEventEmitter.addListener('keyboardDidShow', this.onKeyboardShow);
    this.keyboardWillHideSub = DeviceEventEmitter.addListener('keyboardWillHide', this.onKeyboardHide);

    setTimeout(this.search, 500);
  },

  componentWillUnmount() {
    BevyStore.off(BEVY.SEARCHING, this.onBevySearching);
    BevyStore.off(BEVY.SEARCH_COMPLETE, this.onBevySearchComplete);

    UserStore.off(USER.SEARCHING, this.onUserSearching);
    UserStore.off(USER.SEARCH_ERROR, this.onUserSearchError);
    UserStore.off(USER.SEARCH_COMPLETE, this.onUserSearchComplete);

    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  },

  onUserSearching() {
    this.setState({ fetching: true });
  },
  onBevySearching() {
    this.setState({ fetching: true });
  },

  onUserSearchError() {
    this.setState({ fetching: false });
  },

  onUserSearchComplete() {
    var users = UserStore.getUserSearchResults();
    this.setState({
      fetching: false,
      ds: this.state.ds.cloneWithRows(users),
      users: users
    });
  },
  onBevySearchComplete() {
    var bevies = BevyStore.getSearchList();
    this.setState({
      fetching: false,
      loadingInitial: false,
      ds: this.state.ds.cloneWithRows(bevies),
      bevies: bevies
    });
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

  switchTab(tab) {
    var data, index;
    switch(tab) {
      // switch to bevy search
      case 'Bevies':
        data = this.state.bevies;
        index = 0;
        break;
      // switch to user search
      case 'Users':
        data = this.state.users;
        index = 1;
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
    if(_.isEmpty(data)) this.search();
  },

  search() {
    this.setState({ fetching: true });
    switch(this.state.activeTab) {
      case 0:
        BevyActions.search(this.state.query);
        break;
      case 1:
        UserActions.search(this.state.query);
        break;
    }
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
    switch(this.state.activeTab) {
      case 0:
        // render bevy card
        return (
          <BevyCard
            key={ 'bevycard:' + payload._id }
            bevy={ payload }
            mainNavigator={ this.props.mainNavigator }
          />
        );
        break;
      case 1:
        // render user search item
        return (
          <UserSearchItem
            key={ 'usersearchitem' + payload._id }
            user={ payload }
            showIcon={ false }
            onSelect={ this.goToProfileView }
          />
        );
        break;
    }
  },

  renderHeader() {
    return (
      <View>
        { this.renderNoneFound() }
        { this.renderLoading() }
      </View>
    );
  },

  renderNoneFound() {
    if(this.state.loadingInitial || this.state.fetching) {
      return <View />;
    }
    var itemLabel;
    switch(this.state.activeTab) {
      case 0:
        itemLabel = 'Bevies';
        break;
      case 1:
        itemLabel = 'Users';
        break;
    }
    if(!_.isEmpty(this.state.query) && this.state.ds.getRowCount() <= 0) {
      // user searched for something and no results came up
      // render 'none found' text
      return (
        <View style={ styles.noneFoundContainer }>
          <Text style={ styles.noneFoundText }>
            { 'No ' + itemLabel + ' found' }
          </Text>
        </View>
      );
    }
    return <View />;
  },

  renderLoading() {
    if(!this.state.loadingInitial) return <View />;
    return (
      <View style={ styles.loadingContainer }>
        <Spinner
          isVisible={ true }
          size={ 60 }
          type={ '9CubeGrid' }
          color={ '#2cb673' }
        />
      </View>
    );
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

        <View style={ styles.tabBar }>
          <SegmentedControlIOS
            style={ styles.segmentedControl }
            tintColor='#fff'
            values={['Bevies', 'Users']}
            selectedIndex={ this.state.activeTab }
            onValueChange={ this.switchTab }
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
              title='Loading...'
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
    flex:1,
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

  searchBox: {
    backgroundColor: 'rgba(255,255,255,.3)',
    flexDirection: 'row',
    height: 36,
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 4,
    marginHorizontal: 10,
    marginVertical: 6
  },
  searchIcon: {

  },
  searchInput: {
    flex: 1,
    height: 36,
    paddingHorizontal: 10,
    color: '#fff'
  },

  tabBar: {
    width: constants.width,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#EEE',
    backgroundColor: '#2cb673',
    borderBottomWidth: 1
  },
  segmentedControl: {
    backgroundColor: '#2CB673',
    marginBottom: 7,
    marginHorizontal: 10,
    flex: 1
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

module.exports = SearchView;

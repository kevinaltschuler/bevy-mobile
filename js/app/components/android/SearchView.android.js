/**
 * SearchView.android.js
 * @author albert
 * @author ben. Mostly bert. I just did some tweaking.
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  ListView,
  Image,
  StyleSheet,
  TouchableNativeFeedback,
  ViewPagerAndroid,
  BackAndroid
} = React;
var Icon = require('./../../../shared/components/android/Icon.android.js');
var SubSwitch = require('./SubSwitch.android.js');
var BevySearchItem
  = require('./../../../bevy/components/android/BevySearchItem.android.js');
var UserSearchItem
  = require('./../../../user/components/android/UserSearchItem.android.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var BevyStore = require('./../../../bevy/BevyStore');
var BevyActions = require('./../../../bevy/BevyActions');
var AppActions = require('./../../../app/AppActions');
var UserStore = require('./../../../user/UserStore');
var UserActions = require('./../../../user/UserActions');
var BEVY = constants.BEVY;
var USER = constants.USER;

var SearchView = React.createClass({
  propTypes: {
    searchRoute: React.PropTypes.object,
    searchNavigator: React.PropTypes.object,
    searchType: React.PropTypes.string,
    mainNavigator: React.PropTypes.object
  },

  getInitialState() {
    var bevies = BevyStore.getSearchList();
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      ds: ds.cloneWithRows(bevies),
      searching: false,
      activeTab: 0
    };
  },
  componentDidMount() {
    BevyStore.on(BEVY.SEARCHING, this.handleSearching);
    BevyStore.on(BEVY.SEARCH_COMPLETE, this.handleSearchComplete);
    BevyStore.on(BEVY.SEARCH_ERROR, this.handleSearchError);

    UserStore.on(USER.SEARCHING, this.handleSearching);
    UserStore.on(USER.SEARCH_COMPLETE, this.handleSearchComplete);
    UserStore.on(USER.SEARCH_ERROR, this.handleSearchError);

    BackAndroid.addEventListener('hardwareBackPress', this.onBackButton);
  },

  componentWillUnmount() {
    BevyStore.off(BEVY.SEARCHING, this.handleSearching);
    BevyStore.off(BEVY.SEARCH_COMPLETE, this.handleSearchComplete);
    BevyStore.off(BEVY.SEARCH_ERROR, this.handleSearchError);

    UserStore.off(USER.SEARCHING, this.handleSearching);
    UserStore.off(USER.SEARCH_COMPLETE, this.handleSearchComplete);
    UserStore.off(USER.SEARCH_ERROR, this.handleSearchError);

    BackAndroid.removeEventListener('hardwareBackPress', this.onBackButton);
  },

  onBackButton() {
    this.props.searchNavigator.pop();
    return true;
  },

  handleSearching() {
    this.setState({
      searching: true
    });
  },

  handleSearchComplete() {
    var data;
    switch(this.props.searchType) {
      case 'bevy':
        data = BevyStore.getSearchList();
        break;
      case 'user':
        data = UserStore.getUserSearchResults();
        break;
    }
    this.setState({
      searching: false,
      ds: this.state.ds.cloneWithRows(data)
    });
  },

  handeSearchError() {
    this.setState({
      searching: false,
      ds: this.state.ds.cloneWithRows([])
    });
  },

  switchTab(index) {
    this.setState({
      activeTab: index
    });
    this.pager.setPage(index);
    this.switchSearchType(index);
  },

  handleScroll(e) {
    var scrollY = e.nativeEvent.contentInset.top + e.nativeEvent.contentOffset.y;
    if(this.prevScrollY == undefined) {
      this.prevScrollY = scrollY;
      return;
    }
    if(scrollY - this.prevScrollY > 5) {
      // scrolling down
      constants.getSearchBarActions().blur();
    }
    this.prevScrollY = scrollY;
  },

  onPageSelected(ev) {
    var index = ev.nativeEvent.position;
    this.setState({
      activeTab: index
    });
    this.switchSearchType(index);
  },

  switchSearchType(index) {
    var data;
    switch(index) {
      case 0:
        // bevy
        AppActions.switchSearchType('bevy');
        data = BevyStore.getSearchList();
        break;
      case 1:
        // user
        AppActions.switchSearchType('user');
        data = UserStore.getUserSearchResults();
        if(_.isEmpty(data)) {
          // no users have been searched for yet
          // so we'll trigger it when we switch to that search type
          UserActions.search('');
        }
        break;
    }
    // repopulate data store with proper results
    this.setState({
      ds: this.state.ds.cloneWithRows(data)
    });
  },

  goToProfilePage(user) {
    var route = routes.MAIN.PROFILE;
    route.user = user;
    this.props.mainNavigator.push(route);
  },

  _renderTabBar() {
    return (
      <View style={ styles.tabbar }>
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#DDD', false) }
          onPress={ () => { this.switchTab(0) }}
        >
          <View style={[ styles.searchTab, {
            borderRightColor: '#EEE',
            borderRightWidth: 1
          }]}>
            <Text style={ (this.state.activeTab == 0)
              ? styles.searchTabTextActive
              : styles.searchTabText }>
              Bevies
            </Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#DDD', false) }
          onPress={ () => { this.switchTab(1) }}
        >
          <View style={ styles.searchTab }>
            <Text style={ (this.state.activeTab == 1)
              ? styles.searchTabTextActive
              : styles.searchTabText }>
              Users
            </Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  },

  render() {
    return (
      <View style={ styles.container }>
        { this._renderTabBar() }
        <ViewPagerAndroid
          ref={(pager) => this.pager = pager }
          style={ styles.viewPager }
          initialPage={ 0 }
          keyboardDismissMode='on-drag'
          onPageScroll={() => {}}
          onPageSelected={ this.onPageSelected }
        >
          <View style={ styles.searchPage }>
            <ListView
              dataSource={ this.state.ds }
              style={ styles.searchItemList }
              contentContainerStyle={{ paddingBottom: 10 }}
              scrollRenderAheadDistance={ 300 }
              removeClippedSubviews={ true }
              initialListSize={ 10 }
              pageSize={ 10 }
              onScroll={ this.handleScroll }
              renderRow={ bevy =>
                <BevySearchItem
                  key={ 'bevysearchitem:' + bevy._id }
                  bevy={ bevy }
                  searchNavigator={ this.props.searchNavigator }
                />
              }
            />
          </View>
          <View style={ styles.searchPage }>
            <ListView
              dataSource={ this.state.ds }
              style={ styles.searchItemList }
              contentContainerStyle={{ paddingBottom: 10 }}
              scrollRenderAheadDistance={ 300 }
              removeClippedSubviews={ true }
              initialListSize={ 10 }
              pageSize={ 10 }
              onScroll={ this.handleScroll }
              renderRow={ user =>
                <UserSearchItem
                  key={ 'searchuser:' + user._id }
                  searchUser={ user }
                  onSelect={ this.goToProfilePage }
                  showIcon={ false }
                />
              }
            />
          </View>
        </ViewPagerAndroid>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
    backgroundColor: '#EEE'
  },
  tabbar: {
    width: constants.width,
    height: 40,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#EEE',
    borderBottomWidth: 1
  },
  searchTab: {
    flex: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  searchTabText: {
    color: '#AAA'
  },
  searchTabTextActive: {
    color: '#2CB673'
  },
  viewPager: {
    flex: 1
  },
  searchPage: {
    flex: 1
  },
  searchItemList: {
    flex: 1,
    flexDirection: 'column'
  }
});

module.exports = SearchView;

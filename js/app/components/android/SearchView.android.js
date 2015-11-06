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
var SubSwitch = require('./SubSwitch.android.js');
var BevySearchItem 
  = require('./../../../bevy/components/android/BevySearchItem.android.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var BevyStore = require('./../../../bevy/BevyStore');
var BevyActions = require('./../../../bevy/BevyActions');
var BEVY = constants.BEVY;

var SearchView = React.createClass({
  propTypes: {
    searchRoute: React.PropTypes.object,
    searchNavigator: React.PropTypes.object,
  },
  
  getInitialState() {
    var bevies = BevyStore.getPublicBevies();
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      ds: ds.cloneWithRows(bevies),
      bevies: bevies,
      searching: false,
      searchQuery: BevyStore.getSearchQuery(),
      activeTab: 0
    };
  },
  componentDidMount() {
    BevyStore.on(BEVY.SEARCHING, this.handleSearching);
    BevyStore.on(BEVY.SEARCH_COMPLETE, this.handleSearchComplete);
    BevyStore.on(BEVY.SEARCH_ERROR, this.handleSearchError);
    BackAndroid.addEventListener('hardwareBackPress', this.onBackButton);
  },

  componentWillUnmount() {
    BevyStore.off(BEVY.SEARCHING, this.handleSearching);
    BevyStore.off(BEVY.SEARCH_COMPLETE, this.handleSearchComplete);
    BevyStore.off(BEVY.SEARCH_ERROR, this.handleSearchError);
    BackAndroid.removeEventListener('hardwareBackPress', this.onBackButton);
  },

  onBackButton() {
    this.props.searchNavigator.pop();
    return true;
  },

  handleSearching() {
    this.setState({
      searching: true,
      searchQuery: BevyStore.getSearchQuery(),
      //dataSource: []
    });
  },

  handleSearchComplete() {
    var bevies = BevyStore.getSearchList();
    this.setState({
      searching: false,
      ds: this.state.ds.cloneWithRows(bevies),
      bevies: bevies
    });
  },

  handeSearchError() {
    this.setState({
      searching: false,
      bevies: [],
      ds: this.state.ds.cloneWithRows([])
    });
  },

  switchTab(index) {
    this.setState({
      activeTab: index
    });
    this.pager.setPage(index);
  },

  onPageSelected(ev) {
    var index = ev.nativeEvent.position;
    this.setState({
      activeTab: index
    });
  },

  _renderTabBar() {
    return (
      <View style={ styles.tabbar }>
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#DDD', false) }
          onPress={ () => { this.switchTab(0) }}
        >
          <View style={ styles.searchTab }>
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
              renderHeader={() => 
                <View style={ styles.sectionHeader }>
                  <Image
                    style={ styles.sectionIcon }
                    source={{ uri: constants.siteurl + '/img/logo_100.png' }}
                  />
                  <Text style={ styles.sectionTitle }>
                    Bevies
                  </Text>
                </View>
              }
              renderRow={ bevy => 
                <BevySearchItem
                  key={ 'bevysearchitem:' + bevy._id }
                  bevy={ bevy }
                />
              }
            />
          </View>
          <View style={ styles.searchPage }>

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
    alignItems: 'center'
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
  sectionHeader: {
    backgroundColor: '#FFF',
    height: 36,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  sectionIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 10
  },
  sectionTitle: {
    color: '#AAA'
  },
  searchItemList: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 10
  }
});

module.exports = SearchView;
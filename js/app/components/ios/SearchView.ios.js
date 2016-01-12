/**
 * SearchBar.ios.js
 * @author albert kevin ben
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
  SwitchIOS,
  TabBarIOS,
  ScrollView,
  TextInput,
  SegmentedControlIOS
} = React;
var Icon = require('react-native-vector-icons/Ionicons');
var SearchUser = require('./SearchUser.ios.js');
var BevyCard = require('./../../../bevy/components/ios/BevyCard.ios.js');
var BevySearchItem = require('./../../../bevy/components/ios/BevySearchItem.ios.js');
var UserSearchItem = require('./../../../user/components/ios/UserSearchItem.ios.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var BevyActions = require('./../../../bevy/BevyActions');
var AppActions = require('./../../../app/AppActions');
var UserActions = require('./../../../user/UserActions');
var StatusBarSizeIOS = require('react-native-status-bar-size');
var BevyStore = require('./../../../bevy/BevyStore');
var UserStore = require('./../../../user/UserStore');
var Spinner = require('react-native-spinkit');

var BEVY = constants.BEVY;
var USER = constants.USER;

var SearchView = React.createClass({
  propTypes: {
    searchRoute: React.PropTypes.object,
    searchNavigator: React.PropTypes.object,
  },

  getInitialState() {
    var bevies = BevyStore.getPublicBevies();
    var users = UserStore.getUserSearchResults();
    return {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        .cloneWithRows(bevies),
      userDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        .cloneWithRows(users),
      input: '',
      bevies: BevyStore.getPublicBevies(),
      fetching: false,
      searchQuery: BevyStore.getSearchQuery(),
      userQuery: UserStore.getUserSearchQuery(),
      activeTab: 0
    };
  },

  componentDidMount() {
    BevyStore.on(BEVY.SEARCHING, this.handleSearching);
    BevyStore.on(BEVY.SEARCH_COMPLETE, this.handleSearchComplete);
    UserStore.on(USER.SEARCHING, this.onUserSearching);
    UserStore.on(USER.SEARCH_ERROR, this.onUserSearchError);
    UserStore.on(USER.SEARCH_COMPLETE, this.onUserSearchComplete);
  },

  componentWillUnmount() {
    BevyStore.off(BEVY.SEARCHING, this.handleSearching);
    BevyStore.off(BEVY.SEARCH_COMPLETE, this.handleSearchComplete);
    UserStore.off(USER.SEARCHING, this.onUserSearching);
    UserStore.off(USER.SEARCH_ERROR, this.onUserSearchError);
    UserStore.off(USER.SEARCH_COMPLETE, this.onUserSearchComplete);
  },

  onUserSearching() {
    this.setState({
      fetching: true
    });
  },

  onUserSearchError() {
    this.setState({
      fetching: false,
      searchUsers: []
    });
  },

  onUserSearchComplete() {
    var searchUsers = UserStore.getUserSearchResults();
    this.setState({
      fetching: false,
      userDataSource: this.state.userDataSource.cloneWithRows(searchUsers),
    });
  },

  handleSearching() {
    this.setState({
      fetching: true,
      searchQuery: BevyStore.getSearchQuery(),
      //dataSource: []
    });
  },

  handleSearchComplete() {
    console.log('search done for', this.state.searchQuery);
    //console.log(BevyStore.getSearchList());
    var bevies = BevyStore.getSearchList();
    this.setState({
      fetching: false,
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        .cloneWithRows(bevies),
      bevies: BevyStore.getSearchList()
    });
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
  switchTab(index) {
    this.setState({
      activeTab: 0
    });
    //this.pager.setPage(index);
    this.switchSearchType(index);
  },

  _renderSubSwitch(bevy) {
    var user = this.props.user;
    var subbed = _.find(this.props.user.bevies, function(bevyId){
      return bevyId == bevy._id
    }) != undefined;
    // dont render this if you're an admin
    if(_.contains(bevy.admins, user._id)) return <View/>;
    return (
        <SubSwitch
          subbed={subbed}
          loggedIn={ this.props.loggedIn }
          bevy={bevy}
          user={user}
        />
    );
  },

  componentWillUpdate() {
    /*if(this.props.searchRoute.name == routes.SEARCH.IN.name && !this.state.fetching) {
      // ok, now we're in search.
      // fetch public bevies
      console.log('fetching public');
      BevyActions.fetchPublic();
      this.setState({
        fetching: true
      });
    }*/
  },

  _renderSearchBevies() {
    var bevies = (BevyStore.getSearchList());
    var bevyList = [];

    if(this.state.fetching) {
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
    } else if(!this.state.fetching && _.isEmpty(bevies)) {
      return (
        <View style={ styles.progressContainer }>
          <Text style={ styles.noneFoundText }>
            No Bevies Found
          </Text>
        </View>
      );
    }

    for(var key in bevies) {
      var bevy = bevies[key];
      if(bevy._id == -1) {
        continue;
      }

      bevyList.push(
        <BevyCard
          bevy={bevy}
          key={ 'bevylist:' + bevy._id }
          mainNavigator={this.props.mainNavigator}
        />
      );
    }
    return(
      <ScrollView
        contentContainerStyle={ styles.bevyList }
        automaticallyAdjustContentInsets={true}
        showsVerticalScrollIndicator={true}
      >
        { bevyList }
      </ScrollView>
      );
  },

  // there is probably a better way of doing this
  switchSearchTab(index) {
    if(index == 0){
      //BevyActions.search(this.state.input);
      return(
        <View >
          {this._renderSearchBevies()}
        </View>
        );
    }
    else{
      //UserActions.search(this.state.input);
      return(<SearchUser mainNavigator={this.props.mainNavigator}/>);
    }
  },

  _searchUsers() {
    UserActions.search(this.state.userQuery);
    this.setState({
      fetching: true
    });
  },

  _searchBevies() {
    BevyActions.search(this.state.searchQuery);
    this.setState({
      fetching: true
    });
  },

  _onChangeText(ev) {
    // if bevy tab
    if(this.state.activeTab == 0) {
      //in user tab
      this.setState({
        searchQuery: ev
      });
      if(this.searchTimeout != undefined) {
        clearTimeout(this.searchTimeout);
        delete this.searchTimeout;
      }
      this.searchTimeout = setTimeout(this._searchBevies, 300);
    } else {
      //in user tab
      this.setState({
        userQuery: ev
      });
      if(this.searchTimeout != undefined) {
        clearTimeout(this.searchTimeout);
        delete this.searchTimeout;
      }
      this.searchTimeout = setTimeout(this._searchUsers, 300);
    }
  },

  render() {
    return (
      <View style={styles.container}>
        <View style={ styles.topBarContainer }>
          <View style={{
            height: StatusBarSizeIOS.currentHeight,
            backgroundColor: '#2CB673'
          }}/>
        </View>

        <View style={styles.searchBox}>
         <TextInput
             ref='ToInput'
             style={ styles.Input }
             placeholderTextColor='rgba(255,255,255,.6)'
             onChangeText={(ev) => {
              this._onChangeText(ev);
             }}
             value={ this.state.input }
             placeholder='search...'
           />
        </View>

        <View style={styles.tabBar}>
          <SegmentedControlIOS
            style={{
              backgroundColor: '#2cb673',
              marginBottom: 7,
              marginHorizontal: 10,
              flex: 1
            }}
            tintColor='#fff'
            values={['Bevies', 'Users']}
            selectedIndex={this.state.activeTab}
            onValueChange={(ev) => {
              var tabIndex = (ev == 'Bevies') ? 0 : 1;
              this.setState({
                activeTab: tabIndex
              })
            }}
          />
        </View>
        {this.switchSearchTab(this.state.activeTab)}
      </View>
    )
  }
});

var styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column',
    paddingTop: 0,
    backgroundColor: '#EEE',
  },
  Input: {
    height: 36,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,.3)',
    paddingLeft: 10,
    color: '#fff'
  },

  topBarContainer: {
    flexDirection: 'column',
    paddingTop: 0,
    overflow: 'visible',
    backgroundColor: '#2CB673',
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
  tabBar: {
    width: constants.width,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#EEE',
    backgroundColor: '#2cb673',
    borderBottomWidth: 1
  },
  searchBox: {
    backgroundColor: '#2cb673',
    width: constants.width,
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10
  },
  searchTab: {
    flex: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4
  },
  searchTabText: {
    color: '#EEE'
  },
  searchTabTextActive: {
    color: '#2CB673'
  },
  searchPage: {
    flex: 1
  },
  searchItemList: {
    flex: 1,
    flexDirection: 'column'
  },
  bevyRow: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    justifyContent: 'space-between',
    paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FFF'
  },
  publicBevyTitle: {
    fontSize: 17,
    textAlign: 'center'
  },
  bevyPickerList: {
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'column'
  },
  bevyPickerItem: {
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 47,
    padding: 10,
  },
  bevyPickerImage: {
    width: 36,
    height: 36,
    borderRadius: 18
  },
  bevyPickerName: {
    flex: 1,
    textAlign: 'left',
    fontSize: 17,
    paddingLeft: 15
  },
  bevyButton: {
    flex: 2
  },
  bevyList: {
    flexDirection: 'column',
    width: constants.width,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: -140
  },
  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: constants.height * .7
  },
  noneFoundText: {
    color: '#AAA',
    fontSize: 22
  },
});

module.exports = SearchView;

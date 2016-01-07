/**
 * SearchBar.ios.js
 * @author albert kevin
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
  ScrollView
} = React;
var Icon = require('react-native-vector-icons/Ionicons');
var SubSwitch = require('./SubSwitch.ios.js');
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

var BEVY = constants.BEVY;

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
  },

  componentWillUnmount() {
    BevyStore.off(BEVY.SEARCHING, this.handleSearching);
    BevyStore.off(BEVY.SEARCH_COMPLETE, this.handleSearchComplete);
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
        dataSource={ this.state.userDataSource }
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

  _renderSearchBevies() {
    var bevies = (this.state.bevies)


    var bevyList = [];

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
        style={{flex: 1}}
      >
        { bevyList }
      </ScrollView>
      );
  },

  switchSearchTab(index) {
    if(index == 0)
      return(
        <View>
        {this._renderSearchBevies()}
        </View>
        );
    else
      return(
        <SearchUser>
        </SearchUser>
        );
  },

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.tabBar}>
          <TouchableHighlight
            onPress = {() =>{
              this.setState({activeTab: 0});
            }}
            style={styles.searchTab}
            underlayColor = 'rgba(0,0,0,.1)'
          >
            <Text>bevies</Text>
          </TouchableHighlight>

          <TouchableHighlight
            onPress = {() =>{
              this.setState({activeTab: 1});
            }}
            style={styles.searchTab}
            underlayColor = 'rgba(0,0,0,.1)'
          >
            <Text>users</Text>
          </TouchableHighlight>
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
    backgroundColor: '#fff',
    paddingTop: 70
  },
  tabBar: {
    width: constants.width,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#EEE',
    borderBottomWidth: 1
  },
  searchTab: {
    flex: 1,
    height: 50,
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
    alignItems: 'center',
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
    flexDirection: 'row',
    width: constants.width,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10
  }
});

module.exports = SearchView;

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TextInput,
  StyleSheet,
  Navigator
} = React;
var {
  Icon
} = require('react-native-icons');

var window = require('Dimensions').get('window');
var _ = require('underscore');
var StatusBarSizeIOS = require('react-native-status-bar-size');
var routes = require('./../../routes');
var constants = require('./../../constants');
var BevyStore = require('./../../BevyView/BevyStore');
var BEVY = constants.BEVY;

var BevyList = require('./../../BevyView/components/BevyList.ios.js');
var BevyListButton = require('./BevyListButton.ios.js');
var BackButton = require('./BackButton.ios.js');
var SideMenu = require('react-native-side-menu');
var MainTabBar = require('./../../app/components/MainTabBar.ios.js');
var SearchView = require('./../../app/components/SearchView.ios.js');

var SearchBar = React.createClass({

  propTypes: {
    searchRoute: React.PropTypes.object,
    searchNavigator: React.PropTypes.object,
    menuActions: React.PropTypes.object // for side menu
  },

  getInitialState() {
    var activeRoute = this.props.navState.routeStack[this.props.navState.presentedIndex];
    return {
      activeRoute: activeRoute
    };
  },

  componentDidMount() {
    BevyStore.on(BEVY.SWITCHED, () => {
      // switched bevies
      // force rerender so the left button can update
      this.setState({
        activeRoute: routes.SEARCH.OUT
      })
      this.forceUpdate();
    });
  },

  componentWillUnmount() {
    BevyStore.off(BEVY.SWITCHED);
  },

  onSearchBlur() {

  },

  onSearchFocus() {
    if(this.state.activeRoute.name === routes.SEARCH.OUT.name) {
      this.props.navigator.jumpTo(routes.SEARCH.IN);
      this.setState({
        activeRoute: routes.SEARCH.IN
      });
    }
  },

  onSearch() {

  },

  render() {
    var leftButton = (this.state.activeRoute.name === routes.SEARCH.IN.name)
    ? (
      <BackButton 
        color='#fff'
        onPress={() => {
          this.refs.search.blur();
          this.props.navigator.jumpTo(routes.SEARCH.OUT);
          this.setState({
            activeRoute: routes.SEARCH.OUT
          });
        }}
      />
    )
    : (
      <BevyListButton 
        onPress={() => {
          this.props.menuActions.toggle();
        }}
      />
    );

    return (
      <View style={ styles.navbar }>
        <View style={{
          height: StatusBarSizeIOS.currentHeight
        }}/>
        <View style={ styles.navbarTop }>
          <View style={ styles.left }>
            { leftButton }
            <View style={ styles.searchInputWrapper }>
              <Icon 
                name='ion|ios-search'
                color='#fff'
                size={ 25 }
                style={ styles.searchIcon }
              />
              <TextInput 
                ref='search'
                style={ styles.searchInput }
                autoCapitalize='none'
                autoCorrect={ false }
                clearButtonMode='while-editing'
                enablesReturnKeyAutomatically={ true }
                onBlur={ this.onSearchBlur }
                onFocus={ this.onSearchFocus }
                onChange={ this.onSearch }
                onSubmitEditing={ this.onSearch }
                placeholder='Search'
                placeholderTextColor='#fff'
                returnKeyType='search'
                textAlignVertical='bottom'
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
});


var SearchNavigator = React.createClass({
  propTypes: {
    menuActions: React.PropTypes.object // side menu actions
  },

  render() {
    return (
      <Navigator
        navigator={ this.props.mainNavigator }
        navigationBar={ 
          <SearchBar
            { ...this.props } 
          /> 
        }
        initialRouteStack={ _.toArray(routes.SEARCH) }
        initialRoute={ routes.SEARCH.OUT } // start out of search view
        renderScene={(route, navigator) => {
          var view;
          switch(route.name) {
            case 'in':
              return (
                <SearchView 
                  searchRoute={ route }
                  searchNavigator={ navigator }
                  { ...this.props }
                />
              );
              break;
            case 'out':
            default:
              return (
                <MainTabBar 
                  searchRoute={ route }
                  searchNavigator={ navigator }
                  { ...this.props } 
                />
              );
              break;  
          }
        }}
      />
    );
  }
});

var SearchBarWrapper = React.createClass({

  render() {

    var bevyList = (
      <BevyList 
        myBevies={ this.props.myBevies }
        activeBevy={ this.props.activeBevy }
      />
    );

    return (
      <SideMenu 
        menu={bevyList}
        ref='menu'
        disableGestures={ true }
        touchToClose={ true }
        openMenuOffset={ constants.sideMenuWidth }
      >
        <SearchNavigator
          { ...this.props }
        />
      </SideMenu>
    );
  }
});

var styles = StyleSheet.create({
  navbar: {
    backgroundColor: '#2CB673',
    flexDirection: 'column',
    position: 'absolute',
    top: 0,
    left: 0,
    width: window.width
  },
  navbarTop: {
    height: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginLeft: 20,
    marginRight: 20,
  },
  searchIcon: {
    width: 25,
    height: 25
  },
  searchInput: {
    flex: 1,
    height: 32,
    paddingRight: 20,
    paddingLeft: 10,
    color: 'white'
  },
  left: {
    flex: 1,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start'
  }
});

module.exports = SearchBarWrapper;
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
var BevyStore = require('./../../bevy/BevyStore');
var BevyActions = require('./../../bevy/BevyActions');
var BEVY = constants.BEVY;

var BevyList = require('./../../bevy/components/BevyList.ios.js');
var BevyListButton = require('./BevyListButton.ios.js');
var BackButton = require('./BackButton.ios.js');
var SideMenu = require('react-native-side-menu');
var MainTabBar = require('./../../app/components/MainTabBar.ios.js');
var SearchView = require('./../../app/components/SearchView.ios.js');

var SearchBar = React.createClass({

  propTypes: {
    navState: React.PropTypes.object,
    navigator: React.PropTypes.object,
    menuActions: React.PropTypes.object // for side menu
  },

  getInitialState() {
    var activeRoute = this.props.navState.routeStack[this.props.navState.presentedIndex];
    return {
      activeRoute: activeRoute,
      query: ''
    };
  },

  componentWillReceiveProps(nextProps) {
    /*var activeRoute = nextProps.navState.routeStack[nextProps.navState.presentedIndex];
    this.setState({
      activeRoute: activeRoute
    });*/
  },

  componentDidMount() {
    this.props.navigator.navigationContext.addListener('willfocus', (ev) => {
      var route = ev.data.route;
      this.setState({
        activeRoute: route
      });
      this.forceUpdate();
    });
  },

  componentWillUnmount() {
    this.props.navigator.navigationContext.removeListener('willfocus');
  },

  onSearchBlur() {

  },

  onSearchFocus() {
    if(this.state.activeRoute.name === routes.SEARCH.OUT.name) {
      this.props.navigator.push(routes.SEARCH.IN);
      this.setState({
        activeRoute: routes.SEARCH.IN
      });
    }
  },

  onSearch(query) {
    if(this.searchDelay != undefined) {
      clearTimeout(this.searchDelay);
      delete this.searchDelay;
    }
    this.searchDelay = setTimeout(function() {
      this.setState({
        query: query
      });
      BevyActions.search(this.state.query);
    }.bind(this), 500);
  },

  render() {
    var leftButton = (
      <BackButton 
        color='#fff'
        onPress={() => {
          this.refs.search.blur();
          this.props.navigator.pop();
          this.setState({
            activeRoute: routes.SEARCH.OUT
          });
        }}
      />
    );
    if(this.state.activeRoute.name != routes.SEARCH.IN.name) {
      leftButton = (
        <BevyListButton 
          onPress={() => {
            this.props.menuActions.toggle();
          }}
        />
      );
    }

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
                onBlur={ this.onSearchBlur }
                onFocus={ this.onSearchFocus }
                onChangeText={ this.onSearch }
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
          <SearchBar { ...this.props }/> 
        }
        initialRouteStack={[
          routes.SEARCH.OUT
        ]}
        initialRoute={ routes.SEARCH.OUT } // start out of search view
        renderScene={(route, navigator) => {
          constants.setSearchNavigator(navigator);
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
    return (
      <SideMenu
        menu={<BevyList { ...this.props }/>}
        ref='menu'
        touchToClose={ true }
        openMenuOffset={ constants.sideMenuWidth }
      >
        <SearchNavigator { ...this.props }/>
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
    marginRight: 20,
    marginLeft: 20
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 20
  }
});

module.exports = SearchBarWrapper;
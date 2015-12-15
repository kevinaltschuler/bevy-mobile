/**
 * SearchBar.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet,
  Navigator,
  DrawerLayoutAndroid,
  TouchableNativeFeedback,
  TextInput
} = React;
var MainTabBar = require('./MainTabBar.android.js');
var SearchView = require('./SearchView.android.js');
var Drawer = require('./Drawer.android.js');
var Icon = require('./../../../shared/components/android/Icon.android.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var BevyActions = require('./../../../bevy/BevyActions');
var UserActions = require('./../../../user/UserActions');

var SearchBar = React.createClass({
  propTypes: {
    navState: React.PropTypes.object,
    navigator: React.PropTypes.object,
    drawerOpen: React.PropTypes.bool,
    drawerActions: React.PropTypes.object,
    searchType: React.PropTypes.string
  },

  getInitialState() {
    var activeRoute = this.props.navState.routeStack[this.props.navState.presentedIndex];
    return {
      activeRoute: activeRoute,
      query: ''
    };
  },

  componentDidMount() {
    this.props.navigator.navigationContext.addListener('willfocus',
      this.switchRoute);
      
    constants.setSearchBarActions({
      focus: this.focus,
      blur: this.blur
    });
  },
  componentWillUnmount() {
    //this.props.navigator.navigationContext.removeListener('willfocus',
    //  this.switchRoute);
  },

  switchRoute(ev) {
    var route = ev.data.route;
    this.setState({
      activeRoute: route
    });
    this.forceUpdate();
    if(route.name == routes.SEARCH.IN.name) {
      // focus search bar
      this.searchInput.focus();
    }
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
    this.setState({
      query: query
    });
    if(this.searchDelay != undefined) {
      clearTimeout(this.searchDelay);
      delete this.searchDelay;
    }
    this.searchDelay = setTimeout(this.search, 500);
  },

  search() {
    switch(this.props.searchType) {
      case 'user':
        UserActions.search(this.state.query);
        break;
      case 'bevy':
      default:
        BevyActions.search(this.state.query);
        break;
    }
  },

  focus() {
    this.searchInput.focus();
  },
  blur() {
    this.searchInput.blur();
  },

  goBack() {
    this.searchInput.blur();
    this.props.navigator.pop();
    this.setState({
      activeRoute: routes.SEARCH.OUT,
      query: ''
    });
  },

  toggleDrawer() {
    if(this.props.drawerOpen)
      this.props.drawerActions.close();
    else
      this.props.drawerActions.open();
  },

  _renderLeftButton() {
    if(this.state.activeRoute.name == routes.SEARCH.IN.name) {
      return (
        <TouchableNativeFeedback
          onPress={ this.goBack }
        >
          <View style={ styles.backButton }>
            <Icon
              name='arrow-back'
              color='#FFF'
              size={ 30 }
              style={{
              }}
            />
          </View>
        </TouchableNativeFeedback>
      );
    } else {
      return (
        <TouchableNativeFeedback
          onPress={ this.toggleDrawer }
        >
          <View style={ styles.menuButton }>
            <Icon name='menu' color='#fff' size={ 24 } />
          </View>
        </TouchableNativeFeedback>
      );
    }
  },

  render() {
    // dirty hack to keep the search bar focused as stuff is rendering below it
    // and also keep focused when tab switch between bevies and users
    setTimeout(() => {
      if(this.state.activeRoute.name == routes.SEARCH.IN.name) {
        // focus search bar
        this.searchInput.focus();
      }
    }, 500);
    return (
      <View style={ styles.navbar }>
        { this._renderLeftButton() }
        <View style={ styles.searchInputWrapper }>
          <View style={ styles.searchBackdrop } />
          <Icon
            name='search'
            color='#fff'
            size={ 24 }
          />
          <TextInput
            ref={ref => { this.searchInput = ref; }}
            value={ this.state.query }
            style={ styles.searchInput }
            placeholder='Search'
            placeholderTextColor='#FFF'
            underlineColorAndroid='#6BCC9D'
            onBlur={ this.onSearchBlur }
            onFocus={ this.onSearchFocus }
            onChangeText={ this.onSearch }
          />
        </View>
      </View>
    );
  }
});

var SearchNavigator = React.createClass({
  render() {
    return (
      <Navigator
        configureScene={() => Navigator.SceneConfigs.FloatFromBottomAndroid}
        navigator={ this.props.mainNavigator }
        navigationBar={
          <SearchBar
            { ...this.props }
          />
        }
        initialRouteStack={[
          routes.SEARCH.OUT
        ]}
        sceneStyle={{
          flex: 1
        }}
        renderScene={(route, navigator) => {
          constants.setSearchNavigator(navigator);
          switch(route.name) {
            case routes.SEARCH.IN.name:
              return (
                <SearchView
                  searchRoute={ route }
                  searchNavigator={ navigator }
                  { ...this.props }
                />
              );
              break;
            case routes.SEARCH.OUT.name:
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

  getInitialState() {
    return {
      drawerOpen: false
    };
  },

  openDrawer() {
    this.drawer.openDrawer();
  },

  closeDrawer() {
    this.drawer.closeDrawer();
  },

  toggleDrawer() {
    if(this.state.drawerOpen)
      this.closeDrawer();
    else
      this.openDrawer();
  },

  render() {
    var drawerActions = {
      open: this.openDrawer,
      close: this.closeDrawer,
      toggle: this.toggleDrawer
    };

    return (
      <DrawerLayoutAndroid
        ref={ ref => { this.drawer = ref; }}
        drawerWidth={ (constants.width / 3) * 2 }
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        onDrawerOpen={() => this.setState({ drawerOpen: true })}
        onDrawerClose={() => this.setState({ drawerOpen: false })}
        renderNavigationView={() =>
          <Drawer
            drawerActions={ drawerActions }
            { ...this.props }
          />
        }
      >
        <SearchNavigator
          drawerOpen={ this.state.drawerOpen }
          drawerActions={ drawerActions }
          { ...this.props }
        />
      </DrawerLayoutAndroid>
    );
  }
});

var styles = StyleSheet.create({
  navbar: {
    backgroundColor: '#2CB673',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'absolute',
    top: 0,
    left: 0,
    width: constants.width,
    height: 48
  },
  menuButton: {
    height: 48,
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  backButton: {
    height: 48,
    paddingLeft: 13,
    paddingRight: 13,
    flexDirection: 'row',
    alignItems: 'center'
  },
  backButtonText: {
    color: '#FFF'
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingRight: 10
  },
  searchBackdrop: {
    position: 'absolute',
    top: 7,
    left: 0,
    backgroundColor: '#FFF',
    opacity: 0.3,
    height: 34,
    width: constants.width - 16 - 16 - 10 - 25,
    borderRadius: 5
  },
  searchIcon: {
    width: 25,
    height: 25
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#FFF',
    fontSize: 16,
    marginRight: 8
  },
});

module.exports = SearchBarWrapper;

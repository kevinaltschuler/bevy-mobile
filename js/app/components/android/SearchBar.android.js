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
var Icon = require('react-native-vector-icons/MaterialIcons');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var BevyActions = require('./../../../bevy/BevyActions');

var SearchBar = React.createClass({
  propTypes: {
    navState: React.PropTypes.object,
    navigator: React.PropTypes.object,
    drawerOpen: React.PropTypes.bool,
    drawerActions: React.PropTypes.object
  },

  getInitialState() {
    var activeRoute = this.props.navState.routeStack[this.props.navState.presentedIndex];
    return {
      activeRoute: activeRoute,
      query: ''
    };
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
    //this.props.navigator.navigationContext.removeListener('willfocus');
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

  goBack() {
    this.refs.Search.blur();
    this.props.navigator.pop();
    this.setState({
      activeRoute: routes.SEARCH.OUT
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
    return (
      <View style={ styles.navbar }>
        { this._renderLeftButton() }
        <View style={ styles.searchInputWrapper }>
          <Icon name='search' color='#fff' size={ 24 } />
          <TextInput
            ref='Search'
            style={ styles.searchInput }
            placeholder='Search'
            placeholderTextColor='#FFF'
            underlineColorAndroid='#FFF'
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
          <SearchBar { ...this.props }/> 
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
    this.refs.Drawer.openDrawer();
  },

  closeDrawer() {
    this.refs.Drawer.closeDrawer();
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
        ref='Drawer'
        drawerWidth={ (constants.width / 3) * 2 }
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        onDrawerOpen={() => this.setState({ drawerOpen: true })}
        onDrawerClose={() => this.setState({ drawerOpen: false })}
        renderNavigationView={() => <Drawer drawerActions={ drawerActions } { ...this.props } />}
      >
        <SearchNavigator drawerOpen={ this.state.drawerOpen } drawerActions={ drawerActions } { ...this.props } />
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
    paddingLeft: 8,
    paddingRight: 8,
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
    paddingLeft: 8,
    paddingRight: 8
  },
  searchIcon: {
    width: 25,
    height: 25
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: '#FFF'
  },
});

module.exports = SearchBarWrapper;
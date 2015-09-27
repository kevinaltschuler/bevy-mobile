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

var constants = require('./../../../constants');
var routes = require('./../../../routes');
var TouchableNativeFeedback = require('TouchableNativeFeedback');
var DrawerLayoutAndroid = require('DrawerLayoutAndroid');

var SearchBar = React.createClass({

  propTypes: {
    drawerOpen: React.PropTypes.bool,
    drawerActions: React.PropTypes.object
  },

  toggleDrawer() {
    if(this.props.drawerOpen)
      this.props.drawerActions.close();
    else
      this.props.drawerActions.open();
  },

  render() {
    return (
      <View style={ styles.navbar }>
        <TouchableNativeFeedback  
          background={ TouchableNativeFeedback.Ripple('#000', false) } 
          onPress={ this.toggleDrawer }
        >
          <View style={ styles.menuButton }>
            <Text>Menu</Text>
          </View>
        </TouchableNativeFeedback>
        <View style={ styles.searchInputWrapper }>
          <TextInput
            ref='Search'
            style={ styles.searchInput }
            placeholder='Search'
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
        navigator={ this.props.mainNavigator }
        navigationBar={ 
          <SearchBar { ...this.props }/> 
        }
        initialRouteStack={[
          routes.SEARCH.OUT
        ]}
        sceneStyle={{
          flex: 1,
          width: constants.width
        }}
        renderScene={(route, navigator) => {
          constants.setSearchNavigator(navigator);
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
    height: 48,
    paddingLeft: 8,
    paddingRight: 8
  },
  menuButton: {
    height: 48,
    paddingLeft: 5,
    paddingRight: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginRight: 20,
    marginLeft: 10
  },
  searchIcon: {
    width: 25,
    height: 25
  },
  searchInput: {
    flex: 1,
    height: 48,
    paddingRight: 20,
    paddingLeft: 10,
    color: 'white'
  },
});

module.exports = SearchBarWrapper;
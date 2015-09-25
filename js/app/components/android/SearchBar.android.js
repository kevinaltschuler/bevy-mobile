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
  DrawerLayoutAndroid
} = React;
var MainTabBar = require('./MainTabBar.android.js');
var SearchView = require('./SearchView.android.js');

var constants = require('./../../../constants');
var routes = require('./../../../routes');

var SearchBar = React.createClass({
  render() {
    return (
      <View style={ styles.navbar }>
        <Text>THE NAVBAR</Text>
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
  render() {
    return (
      <DrawerLayoutAndroid
        drawerWidth={ (constants.width / 3) * 2 }
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => <View style={{ flex: 1, backgroundColor: '#00f' }}/>}
      >
        <SearchNavigator { ...this.props } />
      </DrawerLayoutAndroid>
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
    width: constants.width,
    height: 48
  },
});

module.exports = SearchBarWrapper;
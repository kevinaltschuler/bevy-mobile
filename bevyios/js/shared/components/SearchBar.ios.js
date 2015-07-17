'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TextInput,
  StyleSheet
} = React;
var {
  Icon
} = require('react-native-icons');

var window = require('Dimensions').get('window');
var StatusBarSizeIOS = require('react-native-status-bar-size');

var BevyList = require('./../../BevyView/components/BevyList.ios.js');
var BevyListButton = require('./BevyListButton.ios.js');
var SideMenu = require('react-native-side-menu');

var SearchBar = React.createClass({

  propTypes: {
    menuActions: React.PropTypes.object // for side menu
  },

  onSearchFocus() {

  },

  onSearch() {

  },

  render() {
    return (
      <View style={ styles.navbar }>
        <View style={{
          height: StatusBarSizeIOS.currentHeight
        }}/>
        <View style={ styles.navbarTop }>
          <View style={ styles.left }>
            <BevyListButton 
              onPress={() => {
                this.props.menuActions.toggle();
              }}
            />
            <View style={ styles.searchInputWrapper }>
              <Icon 
                name='ion|ios-search'
                color='#fff'
                size={ 25 }
                style={ styles.searchIcon }
              />
              <TextInput 
                style={ styles.searchInput }
                autoCapitalize='none'
                autoCorrect='none'
                clearButtonMode='while-editing'
                enablesReturnKeyAutomatically={ true }
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

var SearchBarWrapper = React.createClass({

  propTypes: {
    view: React.PropTypes.node
  },

  getDefaultProps() {
    return {
      view: <View />
    };
  },

  _renderView() {
    return this.props.view;
  },

  render() {

    var bevyList = (
      <BevyList 
        allBevies={ this.props.allBevies }
        activeBevy={ this.props.activeBevy }
      />
    );

    return (
      <SideMenu 
        menu={bevyList}
        ref='menu'
        disableGestures={ true }
        touchToClose={ true }
        openMenuOffset={ window.width / 2 }
      >
        <SearchBar { ...this.props } />
        { this._renderView() }
      </SideMenu>
    );
  }
});

var styles = StyleSheet.create({
  navbar: {
    backgroundColor: '#2CB673',
    flexDirection: 'column'
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
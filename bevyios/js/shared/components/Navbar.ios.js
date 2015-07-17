'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  createElement
} = React;

var _ = require('underscore');

var {
  Icon
} = require('react-native-icons');

var SideMenu = require('react-native-side-menu');
var BevyListButton = require('./BevyListButton.ios.js');
var BevyList = require('./../../BevyView/components/BevyList.ios.js');

var window = require('Dimensions').get('window');
var StatusBarSizeIOS = require('react-native-status-bar-size');

var NavbarWrapper = React.createClass({

  propTypes: {
    view: React.PropTypes.node
  },

  getDefaultProps() {
    return {
      center: '',
      left: <View />,
      right: <View />,
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
        <Navbar { ...this.props } />
        { this._renderView() }
      </SideMenu>
    );
  }
});

var Navbar = React.createClass({
  propTypes: {
    center: React.PropTypes.node,
    left: React.PropTypes.node,
    right: React.PropTypes.node,
    view: React.PropTypes.node,
    menuActions: React.PropTypes.object // for side menu
  },

  getInitialState() {
    return {}
  },

  onSearchFocus() {

  },

  onSearch() {

  },

  _renderLeft() {
    //var left = createElement(this.props.left, {});
    return this.props.left;
  },

  _renderCenter() {
    if(typeof this.props.center === 'string') {
      return (
        <Text style={ styles.navbarText }>
          { this.props.center }
        </Text>
      );
    } else {
      //var center = createElement(this.props.center, {});
      return this.props.center;
    }
  },

  _renderRight() {
    //var right = createElement(this.props.right, {});
    return this.props.right;
  },

  render() {
    console.log(this.props.right);
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
        <View style={ styles.navbarBottom }>
          <View style={ styles.left }>
            { this._renderLeft() }
          </View>
          <View style={ styles.center }>
            { this._renderCenter() }
          </View>
          <View style={ styles.right }>
            { this._renderRight() }
          </View>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  navbar: {
    backgroundColor: '#2CB673',
    flexDirection: 'column'
  },
  navbarPadding: {
    //height: StatusBarSizeIOS.currentHeight,
  },
  navbarTop: {
    height: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  navbarBottom: {
    backgroundColor: '#fff',
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
  navbarText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '500'
  },
  left: {
    flex: 1,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start'
  },
  center: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  right: {
    flex: 1,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  }
});

module.exports = NavbarWrapper
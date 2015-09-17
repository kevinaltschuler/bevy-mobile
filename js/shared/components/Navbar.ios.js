'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  createElement,
  TouchableHighlight
} = React;

var _ = require('underscore');

var {
  Icon
} = require('react-native-icons');
var routes = require('./../../routes');

var SideMenu = require('react-native-side-menu');
var BevyListButton = require('./BevyListButton.ios.js');
var BevyList = require('./../../bevy/components/BevyList.ios.js');

var window = require('Dimensions').get('window');
var StatusBarSizeIOS = require('react-native-status-bar-size');

var Navbar = React.createClass({
  propTypes: {
    styleParent: React.PropTypes.object,
    styleBottom: React.PropTypes.object,
    center: React.PropTypes.node,
    left: React.PropTypes.node,
    right: React.PropTypes.node
  },

  getDefaultProps() {

    return {
      styleParent: {
        flexDirection: 'column',
        paddingTop: 48,
        overflow: 'visible',
        backgroundColor: '#eee'
      },
      styleBottom: {
        backgroundColor: '#fff',
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: .5,
        borderBottomColor: '#ddd',
        shadowColor: '#111',
        shadowOpacity: .3,
        shadowRadius: 3.5,
        shadowOffset: { width: 0, height: 0 },
      },
      center: 'Default',
      left: <View />,
      right: <View />
    };
  },

  getInitialState() {
    return {}
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

  _renderBottom() {
    if(this.props.center == 'Settings' && this.props.loggedIn) {
      return (
        <View/>
      );
    }
    else {
      return (
        <View style={ this.props.styleBottom }>
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
      );
    }
  },

  render() {
    return (
      <View style={ this.props.styleParent }>
        <View style={{
          height: StatusBarSizeIOS.currentHeight,
          backgroundColor: '#2CB673',
        }}/>
        {this._renderBottom()}
      </View>
    );
  }
});

var styles = StyleSheet.create({
  navbarText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '500'
  },
  settingItemContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingLeft: 16,
    paddingRight: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  navbarTextLight: {
    color: '#888',
    textAlign: 'center',
    paddingRight: 10,
    fontSize: 14,
    fontWeight: '400'
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start'
  },
  center: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  right: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  profileHeader: {
    flexDirection: 'row',
    padding: 5,
    height: 39,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10
  },
  profileDetails: {
    flex: 1,
    flexDirection: 'column',
    marginTop: -2
  },
  profileName: {
    color: '#000', 
    fontSize: 15
  },
  profileEmail: {
    color: '#888', 
    fontSize: 12
  },
});

module.exports = Navbar;
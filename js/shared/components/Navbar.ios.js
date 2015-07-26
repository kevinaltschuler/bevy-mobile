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
        backgroundColor: '#2CB673',
        flexDirection: 'column',
        paddingTop: 48
      },
      styleBottom: {
        backgroundColor: '#fff',
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowRadius: 1,
        shadowOffset: { width: 0, height: 0 },
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
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

  render() {
    return (
      <View style={ this.props.styleParent }>
        <View style={{
          height: StatusBarSizeIOS.currentHeight
        }}/>
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
  left: {
    flex: 1,
    paddingLeft: 15,
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
    paddingRight: 15,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  }
});

module.exports = Navbar;
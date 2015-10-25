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

var Icon = require('react-native-vector-icons/Ionicons');
var routes = require('./../../routes');

var SideMenu = require('react-native-side-menu');
var BevyListButton = require('./BevyListButton.ios.js');
var BevyList = require('./../../bevy/components/BevyList.ios.js');

var routes = require('./../../routes');
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
      },
      center: 'Default',
      left: <View />,
      right: <View />
    };
  },

  getInitialState() {
    return {
      bottomHeight: 40
    }
  },

  _renderLeft() {
    //var left = createElement(this.props.left, {});
    return this.props.left;
  },

  _renderCenter() {
    if(typeof this.props.center === 'string') {
      return (
        <Text style={{textAlign: 'center', fontSize: 17, fontWeight: '500', color: this.props.fontColor}}>
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
    if(this.props.activeBevy)
      var image_url = _.isEmpty(this.props.activeBevy.image_url) ? '/img/default_group_img.png' : this.props.activeBevy.image_url;
    if(this.props.center == 'Settings' && this.props.loggedIn) {
      return (
        <View/>
      );
    }
    if(this.props.activeBevy) {
      if(this.props.activeBevy._id != -1 && (this.props.route == routes.BEVY.POSTLIST.name)) {
        return (
          <Image source={{uri: image_url}} style={[styles.imageBottom, {height: this.state.bottomHeight}]}>
            <View style={styles.imageWrapper}>
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
          </Image>
        );
      }
    }
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
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '500'
  },
  imageBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageWrapper: {
    backgroundColor: 'rgba(0,0,0,.3)',
    flex: 1,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: .5,
    borderBottomColor: '#ddd',
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
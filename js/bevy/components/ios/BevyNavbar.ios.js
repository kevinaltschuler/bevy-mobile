/**
 * BevyNavbar.ios.js
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var SideMenu = require('react-native-side-menu');

var _ = require('underscore');
var routes = require('./../../../routes');
var constants = require('./../../../constants');
var resizeImage = require('./../../../shared/helpers/resizeImage');
var BevyStore = require('./../../../bevy/BevyStore');

var BevyNavbar = React.createClass({
  propTypes: {
    styleParent: React.PropTypes.object,
    center: React.PropTypes.node,
    left: React.PropTypes.node,
    right: React.PropTypes.node,
    bottomHeight: React.PropTypes.number,
    fontColor: React.PropTypes.string,
    activeBoard: React.PropTypes.object,
    activeBevy: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      styleParent: {
        flexDirection: 'column',
        paddingTop: 0,
        overflow: 'visible',
        backgroundColor: '#eee'
      },
      center: 'Default',
      left: <View />,
      right: <View />,
      bottomHeight: 48,
      fontColor: '#FFF'
    };
  },

  _renderLeft() {
    return this.props.left;
  },

  _renderCenter() {
    if(typeof this.props.center === 'string') {
      return (
        <Text
          style={ styles.titleText }
          numberOfLines={ 1 }
        >
          { this.props.center }
        </Text>
      );
    } else {
      return this.props.center;
    }
  },

  _renderRight() {
    return this.props.right;
  },

  render() {
    if(_.isEmpty(this.props.activeBevy)) {
      return <View/>;
    }

    var bevyImageURL = (_.isEmpty(this.props.activeBevy.image))
      ? null : resizeImage(this.props.activeBevy.image, constants.width, 100).url;

    if(this.props.activeBoard._id != undefined) {
      bevyImageURL = resizeImage(this.props.activeBoard.image, constants.width, 100).url;
    }

    if(bevyImageURL == constants.siteurl + '/img/default_group_img.png'
    || bevyImageURL == constants.siteurl + '/img/default_board_img.png') {
      bevyImageURL = null;
    }

    return (
      <View style={ this.props.styleParent }>
        <Image
          source={{ uri: bevyImageURL }}
          style={[ styles.imageBottom, {
            height: this.props.bottomHeight + constants.getStatusBarHeight()
          }]}
        >
          <View style={[ styles.imageWrapper, {
            height: this.props.bottomHeight + constants.getStatusBarHeight()
          }]}>
            <View style={[ styles.bevyTop, {
              paddingTop: constants.getStatusBarHeight()
            }]}>
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
        </Image>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  imageBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    //tintColor: 'rgba(0,0,0,0.1)'
  },
  imageWrapper: {
    backgroundColor: 'rgba(0,0,0,.5)',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start'
  },
  center: {
    flex: 4,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  right: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  bevyTop: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60
  },
  bevyBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    width: constants.width,
    justifyContent: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10
  },
  itemText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 15
  },
  styleBottom: {
    height: 40,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#eee',
    marginTop: 0
  },
  titleText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '500',
    color: '#FFF'
  }
});

module.exports = BevyNavbar;

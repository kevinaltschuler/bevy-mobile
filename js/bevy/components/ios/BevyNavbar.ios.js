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
var StatusBarSizeIOS = require('react-native-status-bar-size');

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
      bottomHeight: 78,
      fontColor: '#FFF'
    };
  },

  _renderLeft() {
    return this.props.left;
  },

  _renderCenter() {
    if(typeof this.props.center === 'string') {
      return (
        <Text style={{
          textAlign: 'center',
          fontSize: 17,
          fontWeight: '500',
          color: this.props.fontColor
        }}>
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

    var image_url = (_.isEmpty(this.props.activeBevy.image))
      ? constants.siteurl + '/img/default_group_img.png'
      : resizeImage(this.props.activeBevy.image, constants.width, 100).url;

    var publicPrivateIcon = (this.props.activeBevy.settings.privacy == 'Private')
      ? 'lock'
      : 'public';

    return (
      <View style={ this.props.styleParent }>
        <Image
          source={{ uri: image_url }}
          style={[ styles.imageBottom, {
            height: this.props.bottomHeight + StatusBarSizeIOS.currentHeight
          }]}
        >
          <View style={[ styles.imageWrapper, {
            height: this.props.bottomHeight + StatusBarSizeIOS.currentHeight
          }]}>
            <View style={[ styles.bevyTop, {
              paddingTop: StatusBarSizeIOS.currentHeight
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
            <View style={ styles.bevyBottom }>
              <View style={ styles.detailItem }>
                <Icon
                  name={ publicPrivateIcon }
                  size={ 18 }
                  color='#fff'
                />
                <Text style={ styles.itemText }>
                  { this.props.activeBevy.settings.privacy }
                </Text>
              </View>
              <View style={ styles.detailItem }>
                <Icon name='group' size={18} color='#fff'/>
                <Text style={styles.itemText}>
                  { this.props.activeBevy.subCount + ' '
                    + ((this.props.activeBevy.subCount == 1)
                    ? 'Subscriber' : 'Subscribers') }
                </Text>
              </View>
              <View style={ styles.detailItem }>
                <Icon name='person' size={18} color='#fff'/>
                <Text style={styles.itemText}>
                  { this.props.activeBevy.admins.length + ' '
                    + ((this.props.activeBevy.admins.length == 1)
                    ? 'Admin' : 'Admins') }
                </Text>
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
    flex: 2,
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
    justifyContent: 'center'
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
  }
});

module.exports = BevyNavbar;

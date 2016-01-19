/**
 * BoardCard.ios.js
 * @author kevin
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet
} = React;
var Swiper = require('react-native-swiper-fork');
var Icon = require('react-native-vector-icons/MaterialIcons');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var resizeImage = require('./../../../shared/helpers/resizeImage');
var BoardActions = require('./../../../board/BoardActions');

var BoardCard = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    board: React.PropTypes.object,
    bevyNavigator: React.PropTypes.object
  },

  getInitialState() {
    return {
    }
  },

  goToBoardSettings() {
    this.props.bevyNavigator.push(routes.BEVY.BOARDSETTINGS);
  },

  render() {
    var board = this.props.board;
    var user = this.props.user;
    if(_.isEmpty(board)) {
      return <View/>;
    }

    var image_url = (_.isEmpty(board.image))
      ? constants.siteurl + '/img/default_board_img.png'
      : resizeImage(board.image, constants.width, 100).url;

    var typeIcon = (board.type == 'announcement') ? 'flag' : 'forum';

    return (
      <View style={ styles.container }>
        <Image
          source={{ uri: image_url }}
          style={ styles.boardImage }
        >
          <View style={ styles.imageWrapper }>
            <Text style={ styles.boardTitle }>
              { board.name }
            </Text>
            <View style={ styles.boardDetails }>
              <View style={ styles.detailItem }>
                <Icon
                  name={ typeIcon }
                  size={ 24 }
                  color='#fff'
                />
                <Text style={ styles.itemText }>
                  { board.type.charAt(0).toUpperCase() + board.type.slice(1) }
                </Text>
              </View>
              <View style={ styles.detailItem }>
                <Icon
                  name='person'
                  size={ 24 }
                  color='#fff'
                />
                <Text style={ styles.itemText }>
                  { board.admins.length } Admins
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={ 0.5 }
                onPress={ this.goToBoardSettings }
                style={ styles.settingButton }
              >
                <Icon
                  name='settings'
                  size={ 24 }
                  color='#FFF'
                />
              </TouchableOpacity>
            </View>
          </View>
        </Image>
      </View>
    )
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    height: 100
  },
  boardImage: {
    flex: 1,
    height: 100,
  },
  boardTitle: {
    color: '#fff',
    paddingLeft: 10,
    fontSize: 18,
    marginBottom: 5
  },
  imageWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.4)',
    height: 100,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-start'
  },
  boardDetails: {
    flexDirection: 'row',
    marginBottom: 5,
    marginLeft: 10
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
});

module.exports = BoardCard;

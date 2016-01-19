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
var BoardActions = require('./../../../bevy/BoardActions');

var BoardCard = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    board: React.PropTypes.object,
    bevyNavigator: React.PropTypes.object
  },

  getInitialState() {
    return {
      isAdmin: _.contains(this.props.board.admins, this.props.user._id)
    }
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      isAdmin: _.contains(nextProps.board.admins, nextProps.user._id)
    });
  },

  goToBoardSettings() {
    this.props.bevyNavigator.push(routes.BEVY.BOARDSETTINGS);
  },

  goToBoardInfo() {
    this.props.bevyNavigator.push(routes.BEVY.BOARDINFO);
  },

  _renderSettingsOrInfo() {
    if(this.state.isAdmin) {
      return (
        <TouchableOpacity
          activeOpacity={ 0.5 }
          onPress={ this.goToBoardSettings }
          style={ styles.settingButton }
        >
          <Icon
            name='more-vert'
            size={ 30 }
            color='#FFF'
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          activeOpacity={ 0.5 }
          onPress={ this.goToBoardInfo }
          style={ styles.settingButton }
        >
          <Icon
            name='more-vert'
            size={ 30 }
            color='#FFF'
          />
        </TouchableOpacity>
      );
    }
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
            <View style={styles.boardLeft}>
              <Text style={ styles.boardTitle }>
                { board.name }
              </Text>

              <View style={ styles.boardDetails }>
                <View style={ styles.detailItem }>
                  <Icon
                    name={ typeIcon }
                    size={ 12 }
                    color='#fff'
                  />
                  <Text style={ styles.itemText }>
                    { board.type.charAt(0).toUpperCase() + board.type.slice(1) }
                  </Text>
                </View>
                <View style={ styles.detailItem }>
                  <Icon
                    name='person'
                    size={ 12 }
                    color='#fff'
                  />
                  <Text style={ styles.itemText }>
                    { board.admins.length } Admins
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.boardRight}>
              { this._renderSettingsOrInfo() }
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
    height: 100,
    paddingHorizontal: 10,
    marginTop: 6,
  },
  boardImage: {
    flex: 1,
    height: 100,
    borderRadius: 4,
    overflow: 'hidden'
  },
  boardTitle: {
    color: '#fff',
    paddingLeft: 5,
    fontSize: 18,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  imageWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.6)',
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  boardLeft: {
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    height: 100,
    flex: 6,
    flexWrap: 'wrap',
    flexDirection: 'column'
  },
  boardRight: {
    width: 35,
    flex: 1,
    alignItems: 'flex-end'
  },
  boardDetails: {
    flexDirection: 'row',
    marginBottom: 5,
    marginLeft: 5
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10
  },
  itemText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 12
  },
  settingButton: {

    marginTop: 10
  }
});

module.exports = BoardCard;

/**
 * BoardCard.ios.js
 *
 * Displays active board information under the bevy navbar
 * also provides a link to the board info/settings view
 *
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
      isAdmin: _.contains(_.pluck(this.props.board.admins, '_id'), this.props.user._id)
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      isAdmin: _.contains(_.pluck(nextProps.board.admins, '_id'), nextProps.user._id)
    });
  },

  goToBoardSettings() {
    this.props.bevyNavigator.push(routes.BEVY.BOARDSETTINGS);
  },

  goToBoardInfo() {
    this.props.bevyNavigator.push(routes.BEVY.BOARDINFO);
  },

  goToSettingsOrInfo() {
    if(this.state.isAdmin) {
      this.goToBoardSettings();
    } else {
      this.goToBoardInfo();
    }
  },

  _renderSettingsOrInfo() {
    return (
      <TouchableOpacity
        activeOpacity={ 0.5 }
        onPress={ this.goToSettingsOrInfo }
        style={ styles.settingButton }
      >
        <Icon
          name='more-vert'
          size={ 30 }
          color='#FFF'
        />
      </TouchableOpacity>
    );
  },

  render() {
    var board = this.props.board;
    var user = this.props.user;
    if(_.isEmpty(board)) {
      return <View/>;
    }

    var imageURL = (_.isEmpty(board.image))
      ? null
      : resizeImage(board.image, constants.width, 100).url;
    if(imageURL == constants.siteurl + '/img/default_board_img.png') {
      imageURL = null;
    }

    var typeIcon = (board.type == 'announcement') ? 'flag' : 'forum';

    return (
      <View style={ styles.container }>
        <Image
          source={{ uri: imageURL }}
          style={ styles.boardImage }
        >
          <View style={ styles.imageWrapper }>
            <View style={ styles.boardLeft }>
              <Text
                numberOfLines={ 1 }
                style={ styles.boardTitle }
              >
                { board.name }
              </Text>
              <View style={ styles.boardDetails }>
                <View style={ styles.detailItem }>
                  <Icon
                    name={ typeIcon }
                    size={ 12 }
                    color='#fff'
                    style={ styles.icon }
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
                    style={ styles.icon }
                  />
                  <Text style={ styles.itemText }>
                    { board.admins.length } Admins
                  </Text>
                </View>
              </View>
            </View>
            <View style={ styles.boardRight }>
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
    height: 60
  },
  boardImage: {
    flex: 1,
    height: 60,
    overflow: 'hidden'
  },
  boardTitle: {
    width: constants.width - 36,
    color: '#fff',
    fontSize: 18,
    marginBottom: 5,
  },
  imageWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.6)',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  boardLeft: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 10
  },
  boardRight: {
    width: 36,
    alignItems: 'flex-end'
  },
  boardDetails: {
    flexDirection: 'row'
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10
  },
  itemText: {
    color: '#fff',
    fontSize: 15
  },
  settingButton: {
    marginTop: 10
  },
  icon: {
    marginRight: 6
  }
});

module.exports = BoardCard;

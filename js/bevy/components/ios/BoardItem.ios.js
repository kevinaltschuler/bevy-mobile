/**
 * BoardItem.ios.js
 * @author kevin
 * i can see maxs bulge
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');

var _ = require('underscore');
var routes = require('./../../../routes');
var constants = require('./../../../constants');
var resizeImage = require('./../../../shared/helpers/resizeImage');
var BevyActions = require('./../../../bevy/BevyActions');
var BevyStore = require('./../../../bevy/BevyStore');
var BoardActions = require('./../../../bevy/BoardActions');

var BoardItem = React.createClass({
  propTypes: {
    board: React.PropTypes.object,
    bevyNavigator: React.PropTypes.object
  },

  switchBoard() {
    BoardActions.switchBoard(this.props.board._id);
    this.props.closeSideMenu();
  },

  render() {
    var board = this.props.board;
    if(_.isEmpty(board)) {
      return <View/>;
    }
    var boardImageSource = BevyStore.getBoardImage(this.props.board.image, 64, 64);

    var typeIcon = (board.type == 'announcement') ? 'flag' : 'forum';

    var activeStyles = {};

    if(!_.isEmpty(this.props.activeBoard)) {
      if(this.props.activeBoard._id == board._id) {
        activeStyles = { backgroundColor: 'rgba(255,255,255,.1)' };
      }
    }

    return (
      <TouchableOpacity
        activeOpacity={ 0.5 }
        onPress={ this.switchBoard }
      >
        <View style={[ styles.boardItem, activeStyles ]}>
          <Image
            source={ boardImageSource }
            style={ styles.boardImage }
          />
          <View style={ styles.boardRight }>
            <Text
              numberOfLines={ 2 }
              style={ styles.boardText }
            >
              { board.name }
            </Text>
            <View style={ styles.boardDetails }>
              <View style={ styles.detailItem }>
                <Icon
                  name={ typeIcon }
                  size={ 18 }
                  color='#bbb'
                />
                <Text style={ styles.itemText }>
                  { board.type.charAt(0).toUpperCase() + board.type.slice(1) }
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
});

var styles = StyleSheet.create({
  boardItem: {
    flexDirection: 'row',
    height: 70,
    paddingLeft: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#444',
    alignItems: 'center'
  },
  boardImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15
  },
  boardText: {
    color: '#fff',
    fontSize: 17,
    marginBottom: 3,
    marginRight: 10
  },
  boardRight: {
    flex: 1,
    flexDirection: 'column',
  },
  boardDetails: {
    flexDirection: 'row',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10
  },
  itemText: {
    color: '#bbb',
    marginLeft: 5,
    fontSize: 17
  },
})

module.exports = BoardItem;

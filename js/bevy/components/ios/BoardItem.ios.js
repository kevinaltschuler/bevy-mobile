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
  TouchableHighlight
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');

var _ = require('underscore');
var routes = require('./../../../routes');
var constants = require('./../../../constants');
var BevyActions = require('./../../BevyActions');
var BoardActions = require('./../../../board/BoardActions');

var BoardItem = React.createClass({
  propTypes: {
    board: React.PropTypes.object
  },

  switchBoard() {
    BoardActions.switchBoard(this.props.board._id);
    //this.props.bevyNavigator.replace(routes.BEVY.BOARDVIEW)
    this.props.closeSideMenu();
  },

  render() {
    var board = this.props.board;
    if(_.isEmpty(board)) {
      return <View/>;
    }
    var image_url = constants.siteurl + '/img/default_board_img.png';
    if(board.image)
      image_url = board.image.path;
    var typeIcon = (board.type == 'announcement')
    ? 'flag'
    : 'forum';

    return (
      <TouchableHighlight
        underlayColor='rgba(255,255,255,.2)'
        onPress={ this.switchBoard }
      >
        <View style={ styles.boardItem }>
          <Image
            source={{ uri: image_url }}
            style={ styles.boardImage }
          />
          <View style={ styles.boardRight }>
            <Text style={ styles.boardText }>
              { board.name }
            </Text>
            <View style={ styles.boardDetails }>
              <View style={ styles.detailItem }>
                <Icon
                  name={ typeIcon }
                  size={ 18 }
                  color='#fff'
                />
              </View>
              <View style={ styles.detailItem }>
                <Icon
                  name='people'
                  size={ 18 }
                  color='#fff'
                />
                <Text style={ styles.itemText }>
                  { board.subCount }
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
});

var styles = StyleSheet.create({
  boardItem: {
    flexDirection: 'row',
    height: 70,
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#666',
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
    marginBottom: 3
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
    color: '#fff',
    marginLeft: 5,
    fontSize: 17
  },
})

module.exports = BoardItem;

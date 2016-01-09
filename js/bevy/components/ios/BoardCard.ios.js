/**
 * BoardCard.ios.js
 * @author kevin
 * this card is gonna look so good
 */

'use strict';

var React = require('react-native');

var {
  View,
  TouchableHighlight,
  Image,
  Text,
  StyleSheet,
  ActionSheetIOS
} = React;

var Swiper = require('react-native-swiper-fork');
var Icon = require('react-native-vector-icons/MaterialIcons');
var _ = require('underscore');
var constants = require('./../../../constants');
var BoardActions = require('./../../../board/BoardActions');

var BoardCard = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    board: React.PropTypes.object
  },

  getInitialState() {
    return {
      joined: _.contains(this.props.user.boards, this.props.board._id)
    }
  },

  _handleJoinLeave(index) {
    var board = this.props.board;
    if(index == 0) {
      if(this.state.joined) {
        BoardActions.leave(board._id);
        this.setState({
          joined: false
        })
      } else {
        if(board.settings.privacy == 'private') {
          BoardActions.requestBoard(board._id)
        }
        else {
          BoardActions.join(board._id)
          this.setState({
            joined: true
          })
        }
      }
    }
  },

  showActionSheet() {
  var board = this.props.board;
    if(this.state.joined) {
      var joinOptions = ['leave', 'cancel'];
    } else {
      if(board.settings.privacy == 'private') {
       var joinOptions = ['request', 'cancel'];
      }
      else {
        var joinOptions = ['join', 'cancel'];
      }
    }

    ActionSheetIOS.showActionSheetWithOptions({
      options: joinOptions,
      cancelButtonIndex: 1,
    },
    (buttonIndex) => {
      this._handleJoinLeave(buttonIndex);
    });
  },

  render() {
    var board = this.props.board;
    var user = this.props.user;
    if(_.isEmpty(board)) {
      return <View/>;
    }
    var image_url = constants.siteurl + '/img/default_board_img.png';
    if(board.image)
      image_url = board.image.path;
    var typeIcon = (board.type == 'announcement')
    ? 'flag'
    : 'forum';
    
    if(this.state.joined) {
      var joinedText = 'joined';
      var joinedColor = '#2cb673';
    } else {
      if(board.settings.privacy == 'private') {
        var joinedText = 'request';
      }
      else {
        var joinedText = 'join';
      }
      var joinedColor = '#aaa'
    }


    return (
      <View style={styles.container}>
        <Image source={{uri: image_url}} style={styles.boardImage}>
          <View style={styles.imageWrapper}>
            <Text style={styles.boardTitle}>
              {board.name}
            </Text>
            <View style={styles.boardDetails}> 
              <View style={styles.detailItem}>
                <Icon name={typeIcon} size={18} color='#fff'/>
                <Text style={styles.itemText}>
                  {board.type}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Icon name='people' size={18} color='#fff'/>
                <Text style={styles.itemText}>
                  {board.subCount} Subscribers
                </Text>
              </View>
            </View>
          </View>
        </Image>
      </View>
    )
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: -25
  },
  boardImage: {
    flex: 1,
    height: 100,
  },
  boardTitle: {
    color: '#fff',
    paddingLeft: 10,
    paddingBottom: 0,
    fontSize: 20,
    fontWeight: 'bold'
  },
  imageWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.3)',
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
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 12
  },
  boardActions: {
    backgroundColor: '#fff'
  },
  slide: {
    flexDirection: 'row',
  },
  actionWrapper: {
    flex: 1,
    height: 50
  },
  action: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionText: {
    color: '#aaa'
  }
});

module.exports = BoardCard;
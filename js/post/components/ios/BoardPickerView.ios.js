/**
 * BoardPickerView.ios.js
 *
 * Lets a user choose what board they want their post
 * to be posted to.
 * Disabled when the newpostview is in post edit mode
 *
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Image,
  TouchableOpacity,
  ListView,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var BoardPickerItem = require('./BoardPickerItem.ios.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var resizeImage = require('./../../../shared/helpers/resizeImage');

var BoardPickerView = React.createClass({
  propTypes: {
    newPostNavigator: React.PropTypes.object,
    newPostRoute: React.PropTypes.object,
    postingToBoard: React.PropTypes.object,
    activeBevy: React.PropTypes.object,
    user: React.PropTypes.object,
    onBoardSelected: React.PropTypes.func
  },

  getInitialState() {
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    var boards = this.props.activeBevy.boards;
    return {
      ds: ds.cloneWithRows(boards),
      boards: boards
    };
  },

  onBoardSelected(board) {
    this.props.onBoardSelected(board);
    this.goBack();
  },

  goBack() {
    this.props.newPostNavigator.pop();
  },

  submit() {
    this.goBack();
  },

  _renderCurrentBoardItem() {
    var board = this.props.postingToBoard;

    var boardImageURL = (_.isEmpty(board.image))
      ? constants.siteurl + '/img/default_group_img.png'
      : resizeImage(board.image, 80, 80).url;

    return (
      <View style={ styles.boardItem }>
        <Image
          source={{ uri: boardImageURL }}
          style={ styles.boardImage }
        />
        <Text
          style={ styles.boardName }
          numberOfLines={ 2 }
        >
          { board.name }
        </Text>
      </View>
    );
  },

  _renderBoardRow(board) {
    return (
      <BoardPickerItem
        key={ 'board:' + board._id }
        board={ board }
        onSelect={ this.onBoardSelected }
        selected={ this.props.postingToBoard._id == board._id }
      />
    );
  },

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.topBarContainer }>
          <View style={{
            height: constants.getStatusBarHeight(),
            backgroundColor: '#2CB673'
          }}/>
          <View style={ styles.topBar }>
            <TouchableOpacity
              activeOpacity={ 0.5 }
              style={ styles.iconButton }
              onPress={ this.goBack }
            >
              <Icon
                name='arrow-back'
                size={ 30 }
                color='#FFF'
              />
            </TouchableOpacity>
            <Text style={ styles.title }>
              Posting To...
            </Text>
            <TouchableOpacity
              activeOpacity={ 0.5 }
              style={ styles.iconButton }
              onPress={ this.submit }
            >
              <View style={ styles.doneButton }>
                <Text style={ styles.doneButtonText }>
                  Done
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <ListView
          ref={ ref => { this.BoardList = ref; }}
          style={ styles.boardList }
          dataSource={ this.state.ds }
          automaticallyAdjustContentInset={ false }
          renderRow={ this._renderBoardRow }
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee'
  },
  topBarContainer: {
    flexDirection: 'column',
    paddingTop: 0,
    overflow: 'visible',
    backgroundColor: '#2CB673',
  },
  topBar: {
    height: 48,
    backgroundColor: '#2CB673',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 17,
    textAlign: 'center',
    color: '#FFF'
  },
  iconButton: {
    width: 48,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  doneButton: {
    width: 60,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  doneButtonText: {
    flex: 1,
    color: '#FFF',
    fontSize: 17,
    textAlign: 'left'
  },
  boardList: {
    flex: 1
  }
});

module.exports = BoardPickerView;

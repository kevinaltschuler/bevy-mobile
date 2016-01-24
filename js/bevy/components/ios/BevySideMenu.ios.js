/**
 * BevySideMenu.ios.js
 * @author kevin
 * albert bamboolzed me yesterday. fuck off albert.
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableHighlight,
  TouchableOpacity
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var BoardItem = require('./BoardItem.ios.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var resizeImage = require('./../../../shared/helpers/resizeImage');
var BevyActions = require('./../../BevyActions');
var BoardActions = require('./../../../bevy/BoardActions');

var BevySideMenu = React.createClass({
  propsTypes: {
    bevyRoute: React.PropTypes.object,
    bevyNavigator: React.PropTypes.object,
    activeBevy: React.PropTypes.object,
    allPosts: React.PropTypes.array,
    user: React.PropTypes.object,
    bevyBoards: React.PropTypes.array
  },

  _renderAdminActions() {

  },

  closeSideMenu() {
    this.props.closeSideMenu();
  },

  clearBoard() {
    BoardActions.clearBoard();
    this.props.closeSideMenu();
  },

  goToNewBoard() {
    this.props.mainNavigator.push(routes.MAIN.NEWBOARD);
  },

  _renderBevyItem() {
    var bevyImageURL = (_.isEmpty(this.props.activeBevy.image))
      ? constants.siteurl + '/img/default_group_img.png'
      : resizeImage(this.props.activeBevy.image, 64, 64).url;

    var publicPrivateIcon = (this.props.activeBevy.settings.privacy == 'Private')
      ? 'lock'
      : 'public';

    return (
      <TouchableOpacity
        activeOpacity={ 0.5 }
        style={styles.bevyCard}
        onPress={ this.clearBoard }
      >
        <View style={ styles.top }>
          <Image
            source={{ uri: bevyImageURL }}
            style={ styles.bevyImage }
          />
          <View style={ styles.bottom }>
            <Text style={ styles.bevyName }>
              { this.props.activeBevy.name }
            </Text>
            <View style={{ flexDirection: 'row'}}>
              <View style={ styles.detailItem }>
                <Icon
                  name={ publicPrivateIcon }
                  size={ 18 }
                  color='#fff'
                />
                <Text style={ styles.itemText }>
                  {(this.props.activeBevy.settings.privacy == 'Private')
                    ? 'Private'
                    : 'Public' }
                </Text>
              </View>
              <View style={ styles.detailItem }>
                <Icon
                  name='people'
                  size={ 18 }
                  color='#fff'
                />
                <Text style={ styles.itemText }>
                  { this.props.activeBevy.subCount }
                </Text>
              </View>
              <View style={ styles.detailItem }>
                <Icon
                  name='person'
                  size={ 18 }
                  color='#fff'
                />
                <Text style={ styles.itemText }>
                  { this.props.activeBevy.admins.length }
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  },

  _renderBoards() {
    var boards = this.props.bevyBoards;
    var boardViews = [];
    for(var key in boards) {
      var board = boards[key];
      boardViews.push(
        <BoardItem
          key={ 'boardItem:' + key }
          board={ board }
          closeSideMenu={ this.closeSideMenu }
          bevyNavigator={ this.props.bevyNavigator }
        />
      );
    }
    return boardViews;
  },

  _renderNewBoardItem() {
    return (
      <TouchableOpacity
        activeOpacity={ 0.5 }
        style={ styles.newBoardItem }
        onPress={ this.goToNewBoard }
      >
        <View style={ styles.newBoardItem }>
          <Icon
            name='add'
            color='#eee'
            size={ 30 }
          />
          <Text style={ styles.newBoardText }>
            Create New Board
          </Text>
        </View>
      </TouchableOpacity>
    );
  },

  render() {
    if(_.isEmpty(this.props.activeBevy)) {
      return <View/>
    }

    return (
      <View style={ styles.container }>
        <View style={{
          height: constants.getStatusBarHeight()
        }}/>
        <ScrollView style={ styles.menuContainer }>
          <View>
            <Text style={ styles.title }>
              Boards
            </Text>
          </View>
          <View style={ styles.boardList }>
            { this._renderBoards() }
            { this._renderNewBoardItem() }
          </View>
        </ScrollView>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#282828',
    alignItems: 'flex-end',
    width: constants.width,
    height: constants.height,
    paddingTop: 5
  },
  menuContainer: {
    width: constants.width * (4/5),
  },
  title: {
    color: '#fff',
    paddingBottom: 5,
    paddingLeft: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: constants.width * (4/5),
    fontSize: 20
  },
  bevyCard: {
    height: 70,
    flexDirection: 'column',
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#666',
  },
  top: {
    height: 69,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bevyImage: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  bevyName: {
    color: '#fff',
    fontSize: 19,
    marginBottom: 5,
    flex: 1
  },
  bottom: {
    flexDirection: 'column',
    paddingLeft: 10,
    flex: 1
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
  newBoardItem: {
    height: 68,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#666',
    borderTopWidth: 1,
    borderTopColor: '#666'
  },
  newBoardText: {
    fontSize: 17,
    color: '#FFF'
  }
})

module.exports = BevySideMenu;

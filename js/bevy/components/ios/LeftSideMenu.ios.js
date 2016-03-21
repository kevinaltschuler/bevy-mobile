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
  AlertIOS,
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
var BevyStore = require('./../../../bevy/BevyStore');
var BoardActions = require('./../../../bevy/BoardActions');

var LeftSideMenu = React.createClass({
  propsTypes: {
    bevyRoute: React.PropTypes.object,
    bevyNavigator: React.PropTypes.object,
    activeBevy: React.PropTypes.object,
    allPosts: React.PropTypes.array,
    user: React.PropTypes.object,
    bevyBoards: React.PropTypes.array,
    activeBoard: React.PropTypes.object
  },

  getInitialState() {
    return {
      joined: _.contains(this.props.user.bevies, this.props.activeBevy._id)
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      joined: _.contains(nextProps.user.bevies, nextProps.activeBevy._id)
    });
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
    if(!this.state.joined) {
      // don't let a user who isn't a part of this bevy create a board
      AlertIOS.alert('You must join this bevy to create a board');
      return;
    }

    var route = {
      name: routes.MAIN.NEWBOARD
    };
    this.props.mainNavigator.push(route);
  },

  _renderBevyItem() {
    var bevyImageSource = BevyStore.getBevyImage(this.props.activeBevy.image, 64, 64);

    var publicPrivateIcon = (this.props.activeBevy.settings.privacy == 'Private')
      ? 'lock'
      : 'public';

    return (
      <TouchableOpacity
        activeOpacity={ 0.5 }
        style={ styles.bevyCard }
        onPress={ this.clearBoard }
      >
        <View style={ styles.top }>
          <Image
            source={ bevyImageSource }
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
                    ? 'Private' : 'Public' }
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
          activeBoard={ this.props.activeBoard }
        />
      );
    }
    return boardViews;
  },

  _renderNewBoardItem() {
    return (
      <TouchableOpacity
        activeOpacity={ 0.5 }
        style={styles.newBoardItem }
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
    alignItems: 'flex-start',
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#444',
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#444',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#444'
  },
  newBoardText: {
    fontSize: 17,
    color: '#FFF'
  }
})

module.exports = LeftSideMenu;

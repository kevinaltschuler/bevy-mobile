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
var StatusBarSizeIOS = require('react-native-status-bar-size');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var BevyActions = require('./../../BevyActions');
var BoardActions = require('./../../../board/BoardActions');

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

  _renderBoards() {
    var boards = this.props.bevyBoards;
    var boardViews = [];
    for(var key in boards) {
      var board = boards[key];
      boardViews.push(
        <BoardItem
          key={'boardItem:' + key}
          board={board}
          closeSideMenu={this.closeSideMenu}
          bevyNavigator={this.props.bevyNavigator}
        />
      );
    }
    return boardViews;
  },

  render() {
    if(_.isEmpty(this.props.activeBevy)) {
      return <View/>
    }
    var bevy = this.props.activeBevy;
    var image_url = constants.siteurl + '/img/default_group_img.png';
    if(bevy.image)
      image_url = bevy.image.path;

    var publicPrivateIcon = (bevy.settings.privacy == 'Private')
      ? 'lock'
      : 'public';

    return (
      <View style={ styles.container }>
        <View style={{
          height: StatusBarSizeIOS.currentHeight,
        }}/>
        <ScrollView style={styles.menuContainer}>
          <TouchableHighlight
            underlayColor='rgba(255,255,255,.2)'
            style={styles.bevyCard}
            onPress={() => {
              BoardActions.clearBoard();
              this.props.closeSideMenu();
            }}
          >
            <View style={ styles.top }>
              <Image
                source={{ uri: image_url }}
                style={ styles.bevyImage }
              />
              <View style={ styles.bottom }>
                <Text style={ styles.bevyName }>
                  { bevy.name }
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  <View style={ styles.detailItem }>
                    <Icon
                      name={ publicPrivateIcon }
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
                      { bevy.subCount }
                    </Text>
                  </View>
                  <View style={ styles.detailItem }>
                    <Icon
                      name='person'
                      size={ 18 }
                      color='#fff'
                    />
                    <Text style={ styles.itemText }>
                      { bevy.admins.length }
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableHighlight>
          <View style={ styles.boardList }>
            { this._renderBoards() }
          </View>
        </ScrollView>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container:  {
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
  bevyCard: {
    height: 70,
    flexDirection: 'column',
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#666',
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bevyImage: {
    width: 60,
    height: 60,
    borderRadius: 30
  },
  bevyName: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 5,
    flex: 1
  },
  bottom: {
    flexDirection: 'column',
    paddingLeft: 10,
    flex: 1
  },
  bottomItem: {
    flexDirection: 'row',
    alignItems: 'center'
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

module.exports = BevySideMenu;

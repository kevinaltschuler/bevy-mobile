/*
 * @author kevin
 * BevySideMenu.ios.js
 * albert bamboolzed me yesterday. fuck off albert.
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
var Icon = require('react-native-vector-icons/Ionicons');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var StatusBarSizeIOS = require('react-native-status-bar-size');
var _ = require('underscore');
var BevyActions = require('./../../BevyActions');
var BoardItem = require('./BoardItem.ios.js');

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
      ?'android-lock'
      :'android-globe';

    return (
      <View style={styles.container}>
        <View style={{
          height: StatusBarSizeIOS.currentHeight,
        }}/>
        <ScrollView style={styles.menuContainer}>
          <TouchableHighlight 
            underlayColor='rgba(255,255,255,.2)'
            style={styles.bevyCard}
            onPress={() => {
              BevyActions.clearBoard();
              this.props.closeSideMenu();
            }}
          >
            <View style={styles.top}>

              <Image source={{uri: image_url}} style={styles.bevyImage}/>

              <View style={styles.bottom}>
                <Text style={styles.bevyName}>
                  {bevy.name}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.detailItem}>
                    <Icon name={publicPrivateIcon} size={18} color='#fff'/>
                  </View>
                  <View style={styles.detailItem}>
                    <Icon name='android-people' size={18} color='#fff'/>
                    <Text style={styles.itemText}>
                      {bevy.subCount}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Icon name='android-person' size={18} color='#fff'/>
                    <Text style={styles.itemText}>
                      {bevy.admins.length}
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={.2}
                style={{alignSelf: 'flex-start', padding: 10, marginRight: 10, marginTop: -10}}
              >
                <Icon name='android-more-vertical' size={32} color='#fff'/>
              </TouchableOpacity>

            </View>
          </TouchableHighlight>
          <View style={styles.boardList}>
            {this._renderBoards()}
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
    backgroundColor: '#555',
    alignItems: 'flex-end',
    width: constants.width,
    height: constants.height
  },
  menuContainer: {
    width: constants.width * 2/3,
  },
  bevyCard: {
    flexDirection: 'column',
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#aaa',
    paddingBottom: 10,
    paddingTop: 10
  },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bevyImage: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  bevyName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 12
  },
})

module.exports = BevySideMenu;
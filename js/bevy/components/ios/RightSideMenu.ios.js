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

var RightSideMenu = React.createClass({
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

  _renderActions() {
    return (
      <View style={{flexDirection: 'column'}}>
        <TouchableHighlight
          underlayColor={ 'rgba(255,255,255,.5)'}
          onPress={() => this.props.mainNavigator.push({name: routes.MAIN.SETTINGSVIEW})}
        >
          <View style={ styles.actionItem }>
            <Icon
              name='person'
              color='#eee'
              size={ 30 }
              style={styles.actionIcon}
            />
            <Text style={ styles.actionText }>
              My Profile
            </Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={'rgba(255,255,255,.5)'}
          onPress={() => {}}
        >
          <View style={ styles.actionItem }>
            <Icon
              name='people'
              color='#eee'
              size={ 30 }
              style={styles.actionIcon}
            />
            <Text style={ styles.actionText }>
              Bevy Directory
            </Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={'rgba(255,255,255,.5)'}
          onPress={() => {}}
        >
          <View style={ styles.actionItem }>
            <Icon
              name='settings'
              color='#eee'
              size={ 30 }
              style={styles.actionIcon}
            />
            <Text style={ styles.actionText }>
              Bevy Settings
            </Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={'rgba(255,255,255,.5)'}
          onPress={() => {}}
        >
          <View style={ styles.actionItem }>
            <Icon
              name='shuffle'
              color='#eee'
              size={ 30 }
              style={styles.actionIcon}
            />
            <Text style={ styles.actionText }>
              Switch Bevy
            </Text>
          </View>
        </TouchableHighlight>
      </View>
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
          { this._renderActions() }
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
  actionItem: {
    height: 95,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: 2,
    borderBottomColor: '#444',
  },
  actionText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold'
  },
  actionIcon: {
    marginHorizontal: 20
  }
})

module.exports = RightSideMenu;

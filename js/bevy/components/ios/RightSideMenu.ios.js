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
  TouchableOpacity
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');

var RightSideMenu = React.createClass({
  propsTypes: {
    mainNavigator: React.PropTypes.object,
    bevyNavigator: React.PropTypes.object,
    activeBevy: React.PropTypes.object,
    user: React.PropTypes.object,
    bevyBoards: React.PropTypes.array,
    activeBoard: React.PropTypes.object
  },

  goToSettings() {
    this.props.mainNavigator.push({ name: routes.MAIN.SETTINGSVIEW });
  },

  goToProfile() {
    this.props.mainNavigator.push({
      name: routes.MAIN.PROFILE,
      profileUser: this.props.user
    });
  },

  goToDirectory() {
    this.props.mainNavigator.push({ name: routes.MAIN.DIRECTORY });
  },

  goToBevySettings() {
    this.props.mainNavigator.push({ name: routes.MAIN.BEVYSETTINGS });
  },

  switchBevy() {

  },

  closeSideMenu() {
    this.props.closeSideMenu();
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
          <MenuItem
            iconName='account-circle'
            text='Account Settings'
            onPress={ this.goToSettings }
          />
          <MenuItem
            iconName='person'
            text='My Profile'
            onPress={ this.goToProfile }
          />
          <MenuItem
            iconName='people'
            text='Bevy Directory'
            onPress={ this.goToDirectory }
          />
          <MenuItem
            iconName='settings'
            text='Bevy Settings'
            onPress={ this.goToBevySettings }
          />
          {/*<MenuItem
            iconName='shuffle'
            text='Switch Bevy'
            onPress={ this.switchBevy }
          />*/}
        </ScrollView>
      </View>
    );
  }
});

var MenuItem = React.createClass({
  propTypes: {
    onPress: React.PropTypes.func,
    iconName: React.PropTypes.string,
    text: React.PropTypes.string
  },

  onPress() {
    this.props.onPress();
  },

  render() {
    return (
      <TouchableOpacity
        activeOpacity={ 0.5 }
        onPress={ this.onPress }
      >
        <View style={ styles.actionItem }>
          <Icon
            name={ this.props.iconName }
            color='#eee'
            size={ 30 }
            style={ styles.actionIcon }
          />
          <Text style={ styles.actionText }>
            { this.props.text }
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
})

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

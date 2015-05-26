/**
 * tabBar.js
 * kevin made this
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Text,
  View,
} = React;

var Icon = require('FAKIconImage');
var SMXTabBarIOS = require('SMXTabBarIOS');
var SMXTabBarItemIOS = SMXTabBarIOS.Item;

var styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 0,
    marginTop: 0,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  tabContent: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    color: 'black',
    margin: 50,
  },
});

var TabBar = React.createClass({

  statics: {
    title: '<TabBarIOS>',
    description: 'Tab-based navigation.'
  },

  getInitialState: function() {
    return {
      selectedTab: 'inBevy',
      notifCount: 0,
      presses: 0,
    };
  },

  _renderContent: function() {
    if(this.state.selectedTab === 'inBevy') {
      return (
        <View style={styles.tabContent}>
        </View>
      );
    }
    else if(this.state.selectedTab === 'notifications') {
      return (
        <View style={styles.tabContent}>
        </View>
      );
    }
    else if(this.state.selectedTab === 'menu') {
      return (
        <View style={styles.tabContent}>
        </View>
      );
    }
  },


  render: function () {
      return (
        <View style={styles.mainContainer}>
          <SMXTabBarIOS
            selectedTab={this.state.selectedTab}
            tintColor={'#c1d82f'}
            barTintColor={'#000000'}
            styles={styles.tabBar}>
            <SMXTabBarItemIOS
                name="inBevy"
                iconName={'ion|ios-list-outline'}
                title={''}
                iconSize={32}
                selected={this.state.selectedTab === 'inBevy'}
                onPress={() => {
                this.setState({
                  selectedTab: 'inBevy',
                });
              }}>
              {this._renderContent()}
            </SMXTabBarItemIOS>
            <SMXTabBarItemIOS
                name="notifications"
                iconName={'ion|ios-bell-outline'}
                title={''}
                iconSize={32}
                selected={this.state.selectedTab === 'notifications'}
                onPress={() => {
                this.setState({
                  selectedTab: 'notifications',
                });
              }}>
              {this._renderContent()}
            </SMXTabBarItemIOS>
            <SMXTabBarItemIOS
                name="menu"
                iconName={'ion|ios-drag'}
                title={''}
                iconSize={32}
                selected={this.state.selectedTab === 'menu'}
                onPress={() => {
                this.setState({
                  selectedTab: 'menu',
                });
              }}>
              {this._renderContent()}
            </SMXTabBarItemIOS>
          </SMXTabBarIOS>
        </View>
      );
    }
});

module.exports = TabBar;

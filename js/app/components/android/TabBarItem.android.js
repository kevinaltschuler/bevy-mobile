/**
 * TabBarItem.android.js
 * @author  albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TouchableNativeFeedback,
  StyleSheet
} = React;

var _ = require('underscore');
var constants = require('./../../../constants');
var noop = function() {};

var TabBarItem = React.createClass({
  propTypes: {
    onPress: React.PropTypes.func,
    icon: React.PropTypes.node,
    selectedIcon: React.PropTypes.node,
    tab: React.PropTypes.string,
    activeTab: React.PropTypes.string,
    unreadCount: React.PropTypes.number // used for the notification tab bar item
  },

  getDefaultProps() { 
    return {
      onPress: noop,
      icon: <Text>Icon</Text>,
      selectedIcon: <Text>Selected Icon</Text>,
      tab: '',
      activeTab: '',
      unreadCount: -1
    };
  },

  getInitialState() {
    return {
      active: this.props.activeTab == this.props.tab
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      active: nextProps.activeTab == nextProps.tab
    });
  },

  _renderIcon() {
    return (this.state.active) ? this.props.selectedIcon : this.props.icon;
  },

  _renderUnreadBadge() {
    if(this.props.unreadCount < 1) return <View />;
    return (
      <View style={ styles.unreadBadge }>
        <Text style={ styles.unreadBadgeText }>
          { this.props.unreadCount }
        </Text>
      </View>
    );
  },

  render() {
    var buttonStyles = (this.state.active)
      ? [styles.tabBarItem, { backgroundColor: '#FFF' }]
      : [styles.tabBarItem, { backgroundColor: '#FFF' }];
    return (
      <TouchableNativeFeedback
        onPress={ this.props.onPress }
      >
        <View style={ buttonStyles }>
          { this._renderIcon() }
          { this._renderUnreadBadge() }
        </View>
      </TouchableNativeFeedback>
    );
  }
});

var styles = StyleSheet.create({
  tabBarItem: {
    height: 48,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  unreadBadge: {
    position: 'absolute',
    top: 5,
    left: constants.width / 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  unreadBadgeText: {
    color: '#FFF',
    fontSize: 12
  }
});

module.exports = TabBarItem;
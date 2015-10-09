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

var noop = function() {};

var TabBarItem = React.createClass({
  propTypes: {
    onPress: React.PropTypes.func,
    icon: React.PropTypes.node,
    selectedIcon: React.PropTypes.node,
    tab: React.PropTypes.string,
    activeTab: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      onPress: noop,
      icon: <Text>Icon</Text>,
      selectedIcon: <Text>Selected Icon</Text>,
      tab: '',
      activeTab: ''
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
  }
});

module.exports = TabBarItem;
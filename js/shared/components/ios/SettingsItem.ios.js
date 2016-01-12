/**
 * SettingsItem.ios.js
 *
 * shared component for emulating the style of iOS's
 * native settings app items
 *
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');

var _ = require('underscore');

var SettingsItem = React.createClass({
  propTypes: {
    checked: React.PropTypes.bool,
    onPress: React.PropTypes.func,
    title: React.PropTypes.string,
    icon: React.PropTypes.element
  },

  getDefaultProps() {
    return {
      checked: false,
      onPress: null,
      title: 'Default Settings Title'
    };
  },

  onPress() {
    this.props.onPress();
  },

  _renderIcon() {
    if(this.props.icon) {
      return this.props.icon;
    } else {
      return <View />;
    }
  },

  _renderCheck() {
    if(!this.props.checked) return <View />;
    return (
      <Icon
        name='check-circle'
        color='#2CB673'
        size={ 35 }
        style={{ width: 35, height: 35 }}
      />
    );
  },

  _renderBody() {
    return (
      <View style={ styles.settingItem }>
        { this._renderIcon() }
        <Text style={ styles.settingTitle }>
          { this.props.title }
        </Text>
        { this._renderCheck() }
      </View>
    )
  },

  render() {
    if(this.props.onPress == null) {
      return this._renderBody();
    }
    return (
      <TouchableOpacity
        activeOpacity={ 0.5 }
        style={[ styles.settingItemContainer ]}
        onPress={ this.onPress }
      >
        { this._renderBody() }
      </TouchableOpacity>
    );
  }
});

var styles = StyleSheet.create({
  settingItemContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
  },
  settingItem: {
    backgroundColor: '#FFF',
    flex: 1,
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    paddingHorizontal: 15
  },
  settingTitle: {
    flex: 1,
    fontSize: 17,
    color: '#222',
    marginLeft: 15
  },
  settingValue: {
    alignSelf: 'flex-end',
    fontSize: 17,
    color: '#888'
  },
});

module.exports = SettingsItem;

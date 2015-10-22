/**
 * SettingsItem.ios.js
 *
 * shared component for emulating the style of iOS's
 * native settings app items
 *
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TouchableHighlight,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/Ionicons');

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
      onPress: this.noop,
      title: 'Default Settings Title'
    };
  },

  noop() {
  },

  render() {
    var check = (this.props.checked)
    ? (
      <Icon
        name='ios-checkmark-empty'
        color='#2CB673'
        size={ 35 }
        style={{ width: 35, height: 35 }}
      />
    )
    : <View />;

    var icon = (this.props.icon)
    ? this.props.icon
    : <View/>;

    return (
      <TouchableHighlight
        underlayColor='rgba(0,0,0,0.1)'
        style={[ styles.settingItemContainer ]}
        onPress={() => {
          this.props.onPress();
        }}
      >
        <View style={ styles.settingItem}>
          { icon }
          <Text style={ styles.settingTitle }>
            { this.props.title }
          </Text>
          { check }
        </View>
      </TouchableHighlight>
    );
  }
});

var styles = StyleSheet.create({
  settingItemContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  settingItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  settingTitle: {
    flex: 1,
    fontSize: 17,
    color: '#222',
    marginLeft: 10
  },
  settingValue: {
    alignSelf: 'flex-end',
    fontSize: 17,
    color: '#888'
  },
});

module.exports = SettingsItem;
/**
 * BevyPickerItem.android.js
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TouchableNativeFeedback,
  Image,
  StyleSheet
} = React;
var Icon = require('./../../../shared/components/android/Icon.android.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var BevyStore = require('./../../../bevy/BevyStore');

var BevyPickerItem = React.createClass({
  propTypes: {
    bevy: React.PropTypes.object,
    isSelected: React.PropTypes.bool,
    onSwitchBevy: React.PropTypes.func
  },

  _renderIcon() {
    if(!this.props.isSelected) return (
      <Icon
        name='check-box-outline-blank'
        size={ 40 }
        color='#2CB673'
      />
    );
    return (
      <Icon
        name='check-box'
        size={ 40 }
        color='#2CB673'
      />
    );
  },

  render() {
    return (
      <TouchableNativeFeedback
        background={ TouchableNativeFeedback.Ripple('#DDD', false) }
        onPress={() => {
          this.props.onSwitchBevy(this.props.bevy);
        }} 
      >
        <View style={ styles.bevyPickerItem }>
          { this._renderIcon() }
          <Image 
            style={ styles.bevyImage }
            source={ BevyStore.getBevyImage(this.props.bevy._id, 50, 50) }
          />
          <Text style={ styles.bevyName }>{ this.props.bevy.name }</Text>
        </View>
      </TouchableNativeFeedback>
    );
  }
});

var styles = StyleSheet.create({
  bevyPickerItem: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12
  },
  bevyImage: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 10,
    marginLeft: 10
  },
  bevyName: {
    flex: 1,
    textAlign: 'left',
    color: '#888'
  }
});

module.exports = BevyPickerItem;
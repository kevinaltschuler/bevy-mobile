/**
 * BevyPickerItem.ios.js
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet
} = React;

var _ = require('underscore');
var constants = require('./../../../constants');
var resizeImage = require('./../../../shared/helpers/resizeImage');

var BevyPickerItem = React.createClass({
  propTypes: {
    bevy: React.PropTypes.object,
    onSwitchBevy: React.PropTypes.func
  },

  switchBevy() {
    this.props.onSwitchBevy(this.props.bevy);
  },

  render() {
    var imageUri = (_.isEmpty(this.props.bevy.image))
      ? constants.siteurl + '/img/logo_200.png'
      : resizeImage(this.props.bevy.image, 64, 64).url;

    return (
      <TouchableHighlight
        underlayColor='rgba(0,0,0,.1)'
        onPress={ this.switchBevy }
      >
        <View style={ styles.bevyPickerItem }>
          <Image
            style={ styles.bevyPickerImage }
            source={{ uri: imageUri }}
          />
          <Text style={ styles.bevyPickerName }>
            { this.props.bevy.name }
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
});

var styles = StyleSheet.create({
  bevyPickerItem: {
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  bevyPickerImage: {
    width: 36,
    height: 36,
    borderRadius: 18
  },
  bevyPickerName: {
    flex: 1,
    textAlign: 'left',
    fontSize: 17,
    paddingLeft: 15
  }
});

module.exports = BevyPickerItem;

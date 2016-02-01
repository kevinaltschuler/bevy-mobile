/**
 * BevySearchItem.android.js
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TouchableHighlight,
  Image,
  StyleSheet
} = React;

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var BevyActions = require('./../../../bevy/BevyActions');
var BevyStore = require('./../../../bevy/BevyStore');

var BevySearchItem = React.createClass({
  propTypes: {
    bevy: React.PropTypes.object,
    onPress: React.PropTypes.func
  },

  onPress() {
    this.props.onPress(this.props.bevy);
  },

  render() {
    return (
      <TouchableHighlight
        onPress={ this.onPress }
      >
        <View style={ styles.container }>
          <Image
            style={ styles.image }
            source={ BevyStore.getBevyImage(this.props.bevy.image, 30, 30) }
          />
          <View style={ styles.details }>
            <Text style={ styles.name }>
              { this.props.bevy.name }
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    width: constants.width,
    paddingHorizontal: 10,
  },
  image: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10
  },
  details: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#EEE',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  name: {
    flex: 1,
    textAlign: 'left',
    color: '#000'
  }
});

module.exports = BevySearchItem;

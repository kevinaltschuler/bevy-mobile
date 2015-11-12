/**
 * RelatedBevyItem.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableNativeFeedback
} = React;

var _ = require('underscore');
var routes = require('./../../../routes');
var BevyActions = require('./../../BevyActions');
var BevyStore = require('./../../BevyStore');

var RelatedBevyItem = React.createClass({
  propTypes: {
    bevy: React.PropTypes.object,
    bevyNavigator: React.PropTypes.object
  },

  onPress() {
    // switch to new bevy
    BevyActions.switchBevy(this.props.bevy._id);
    // switch back to post view
    this.props.bevyNavigator.popToTop();
  },

  render() {
    return (
      <TouchableNativeFeedback
        background={ TouchableNativeFeedback.Ripple('#EEE', false) }
        onPress={ this.onPress }
      >
        <View style={ styles.container }>
          <Image
            source={ BevyStore.getBevyImage(this.props.bevy._id, 50, 50) }
            style={ styles.bevyImage }
          />
          <Text style={ styles.bevyName }>{ this.props.bevy.name }</Text>
        </View>
      </TouchableNativeFeedback>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  bevyImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10
  },
  bevyName: {
    color: '#AAA'
  }
});

module.exports = RelatedBevyItem;
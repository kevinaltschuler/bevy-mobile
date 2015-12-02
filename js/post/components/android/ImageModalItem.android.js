/**
 * ImageModalItem.android.js
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  Image,
  StyleSheet
} = React;

var _ = require('underscore');
var constants = require('./../../../constants');
var resizeImage = require('./../../../shared/helpers/resizeImage');

var ImageModalItem = React.createClass({
  propTypes: {
    image: React.PropTypes.object
  },

  getInitialState() {
    return {
    }
  },

  render() {
    var image = resizeImage(
      this.props.image, 
      constants.width, 
      constants.height
    );

    return (this.props.image.foreign)
    ? (
      <Image
        style={{
          flex: 1
        }}
        source={{ uri: this.props.image.path }}
        resizeMode='contain'
      />
    ) : (
      <View
        style={{
          flex: 1,
          paddingTop: 48,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Image
          style={{
            width: image.width,
            height: image.height
          }}
          source={{ uri: image.url }}
          resizeMode='cover'
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
});

module.exports = ImageModalItem;
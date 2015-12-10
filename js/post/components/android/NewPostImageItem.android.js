/**
 * NewPostImageItem.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Image,
  TouchableNativeFeedback,
  StyleSheet
} = React;
var Icon = require('./../../../shared/components/android/Icon.android.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var resizeImage = require('./../../../shared/helpers/resizeImage');

var NewPostImageItem = React.createClass({
  propTypes: {
    image: React.PropTypes.object,
    onRemove: React.PropTypes.func
  },

  remove() {
    this.props.onRemove(this.props.image);
  },

  render() {
    var image = resizeImage(this.props.image, 75, 75);
    return (
        <View style={{
          backgroundColor: '#000',
          width: 75,
          height: 75,
          borderRadius: 5,
          marginHorizontal: 5
        }}>
          <Image
            source={{ uri: image.url }}
            style={{
              width: 75,
              height: 75,
              borderRadius: 5
            }}
            resizeMode='cover'
          />
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#FFF', false) }
            onPress={ this.remove }
          >
            <View style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 30,
              height: 30
            }}>
              <Icon
                name='close'
                size={ 30 }
                color='#FFF'
              />
            </View>
          </TouchableNativeFeedback>
        </View>
    );
  }
});

module.exports = NewPostImageItem;

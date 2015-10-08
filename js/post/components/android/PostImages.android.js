/**
 * PostImages.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Image,
  TouchableNativeFeedback,
  TouchableHighlight,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet
} = React;

var _ = require('underscore');

var PostImages = React.createClass({
  propTypes: {
    post: React.PropTypes.object
  },

  getInitialState() {
    return {
      overlayVisible: false
    };
  },

  _renderImageCount() {
    var imageCount = this.props.post.images.length;

    if(imageCount < 1) return <View />;
    else return (
      <Text style={ styles.imageCount }>
        + { imageCount - 1 } more
      </Text>
    )
  },

  render() {
    if(_.isEmpty(this.props.post.images)) return <View />;

    var image_url = _.first(this.props.post.images);

    return (
      <TouchableOpacity
        activeOpacity={ 0.8 }
        onPress={() => {}}
      >
        <Image
          style={ styles.image }
          source={{ uri: image_url }}
          resizeMode='cover'
        >
          { this._renderImageCount() }
        </Image>
      </TouchableOpacity>
    );
  }
});

var styles = StyleSheet.create({
  image: {
    height: 75,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    marginTop: 8
  },
  imageCount: {
    marginTop: 5,
    marginRight: 10,
    backgroundColor: 'rgba(0,0,0,0)',
    color: '#eee',
    fontSize: 17
  },
});

module.exports = PostImages;
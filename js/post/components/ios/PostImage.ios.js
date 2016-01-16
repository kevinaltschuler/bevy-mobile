/**
 * PostImage.ios.js
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var ImageOverlay = require('./ImageOverlay.ios.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');

var PostImage = React.createClass({
  propTypes: {
    post: React.PropTypes.object
  },

  getInitialState() {
    return {
      showOverlay: false
    };
  },

  showOverlay() {
    this.setState({ showOverlay: true });
  },

  hideOverlay() {
    this.setState({ showOverlay: false });
  },

  _renderImageOverlay() {
    if(this.props.post.images.length <= 0) return null;
    return (
      <ImageOverlay
        images={ this.props.post.images }
        isVisible={ this.state.showOverlay }
        post={ this.props.post }
        onHide={ this.hideOverlay }
      />
    );
  },

  _renderImageCount() {
    var imageCount = this.props.post.images.length;
    return (imageCount > 1)
    ? (
      <Text style={ styles.postImageCountText }>
        + { imageCount - 1 } more
      </Text>
    ) : <View />;
  },

  render() {
    if(_.isEmpty(this.props.post.images)) {
      return <View />;
    }

    return (
      <View>
        { this._renderImageOverlay() }
        <TouchableOpacity
          activeOpacity={ 0.5 }
          onPress={ this.showOverlay }
        >
          <Image
            style={ styles.postImage }
            source={{ uri: this.props.post.images[0].path }}
            resizeMode='cover'
          >
            { this._renderImageCount() }
          </Image>
        </TouchableOpacity>
      </View>
    );
  },
});

var styles = StyleSheet.create({
  postImage: {
    height: 75,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end'
  },
  postImageCountText: {
    marginTop: 5,
    marginRight: 10,
    backgroundColor: 'rgba(0,0,0,0)',
    color: '#eee',
    fontSize: 17
  },
});

module.exports = PostImage;

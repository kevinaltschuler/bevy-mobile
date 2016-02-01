/**
 * ImageOverlayGallery.ios.js
 *
 * Gallery view that is pushed to the end of
 * image items in ImageOverlay if there's more than
 * 2 images in the array.
 *
 * Let's the user easily jump back to any image in the list
 *
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet
} = React;
var Spinner = require('react-native-spinkit');

var _ = require('underscore');
var constants = require('./../../../constants');
var resizeImage = require('./../../../shared/helpers/resizeImage');

var itemWidth = 80;

var ImageOverlayGallery = React.createClass({
  propTypes: {
    onImageSelect: React.PropTypes.func,
    images: React.PropTypes.array
  },

  getDefaultProps() {
    return {
      onImageSelect: _.noop
    }
  },

  getInitialState() {
    return {
    };
  },

  onImageSelect(image, index) {
    this.props.onImageSelect(image, index);
  },

  renderImageItems() {
    var imagesPerRow = Math.floor(constants.width / itemWidth);
    var numRows = Math.ceil(this.props.images.length / imagesPerRow);
    var rows = [];
    for(var i = 0; i < numRows; i++) {
      var images = [];
      for(var j = (i * imagesPerRow); j < (i * imagesPerRow) + imagesPerRow; j++) {
        var image = this.props.images[j];
        if(image == undefined) {
          images.push(
            <View
              key={ 'galleryitem:' + j }
              style={{
                flex: 1
              }}
            />
          );
          continue;
        }
        images.push(
          <GalleryItem
            key={ 'galleryitem:' + j }
            onSelect={ this.onImageSelect }
            image={ image }
            index={ j }
          />
        );
      }
      rows.push(
        <View
          key={ 'galleryrow:' + i }
          style={ styles.galleryRow }
        >
          { images }
        </View>
      );
    }
    return rows;
  },

  render() {
    return (
      <View style={ styles.container }>
        <ScrollView
          style={ styles.scrollView }
          automaticallyAdjustContentInsets={ false }
        >
          { this.renderImageItems() }
        </ScrollView>
      </View>
    );
  }
});

var GalleryItem = React.createClass({
  propTypes: {
    onSelect: React.PropTypes.func,
    image: React.PropTypes.object,
    index: React.PropTypes.number
  },

  getInitialState() {
    return {
      loaded: false,
      error: ''
    };
  },

  onLoadStart() {
    this.setState({ loaded: false });
  },
  onLoad() {
    this.setState({ loaded: true });
  },
  onLoadError(ev) {
    this.setState({
      loaded: true,
      error: ev.nativeEvent.error
    });
  },
  onLoadProgress(ev) {
  },

  onSelect() {
    this.props.onSelect(this.props.image, this.props.index);
  },

  renderLoading() {
    if(this.state.loaded) return <View />;
    return (
      <View style={ styles.loadingContainer }>
        <Spinner
          isVisible={ true }
          size={ 40 }
          type={ 'Arc' }
          color={ '#2CB673' }
        />
      </View>
    );
  },

  render() {
    var imageURL = (this.props.image.foreign)
      ? this.props.image.path
      : resizeImage(this.props.image, 128, 128).url;

    return (
      <View style={ styles.itemContainer }>
        <TouchableOpacity
          activeOpacity={ 0.5 }
          style={ styles.imageButton }
          onPress={ this.onSelect }
        >
          <Image
            source={{ uri: imageURL }}
            style={ styles.image }
            resizeMode='contain'
            onLoadStart={ this.onLoadStart }
            onLoad={ this.onLoad }
            onError={ this.onLoadError }
            onProgress={ this.onLoadProgress }
          >
            { this.renderLoading() }
          </Image>
        </TouchableOpacity>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0)',
    height: constants.height - 48 - 10 - 10, // top bar plus padding
    width: constants.width,
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 15
  },
  scrollView: {
    flex: 1,
    width: constants.width
  },
  galleryRow: {
    width: constants.width,
    height: itemWidth,
    flexDirection: 'row'
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageButton: {
    width: itemWidth,
    height: itemWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    //backgroundColor: '#0008',
    width: itemWidth - 10,
    height: itemWidth - 10
  },
  loadingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
});

module.exports = ImageOverlayGallery;

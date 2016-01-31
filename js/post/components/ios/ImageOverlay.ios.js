/**
 * ImageOverlay.ios.js
 *
 * Modal for displaying images in a slideshow
 *
 * @author albert
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  Image,
  Animated,
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var { BlurView } = require('react-native-blur');
var ImageOverlayItem = require('./ImageOverlayItem.ios.js');
var ImageOverlayGallery = require('./ImageOverlayGallery.ios.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var resizeImage = require('./../../../shared/helpers/resizeImage');

var ImageOverlay = React.createClass({
  propTypes: {
    isVisible: React.PropTypes.bool,
    images: React.PropTypes.array,
    post: React.PropTypes.object,
    onHide: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      onHide: _.noop
    };
  },

  getInitialState() {
    return {
      imageIndex: 0,
      indexBarX: new Animated.Value(0)
    };
  },

  hide() {
    this.props.onHide();
  },

  /**
   * called when an image in the gallery view is pressed
   */
  onImageSelect(image, index) {
    // scroll to the image
    this.ScrollView.scrollTo(0, index * constants.width, false);
  },

  onScroll(ev) {
    // the width of each scrollview item (each image)
    var pageWidth = constants.width;
    // how far along we are in the list, in pixels
    var scrollOffset = ev.nativeEvent.contentOffset.x;
    // see from the offset how far along we are
    var imageIndex = scrollOffset / pageWidth;

    // if we're in the middle of a scroll, then return
    if(imageIndex % 1 !== 0) return;

    // update state
    this.setState({ imageIndex: imageIndex });
    // animate index bar
    Animated.timing(
      this.state.indexBarX, {
        toValue: (constants.width / (this.props.images.length + 1)) * imageIndex,
        duration: 200
      }
    ).start();
  },

  goToGallery() {
    this.ScrollView.scrollTo(0, this.props.images.length * constants.width, false);
  },

  renderIndexBar() {
    // dont render this if there's only one image being displayed
    if(this.props.images.length <= 1) return <View />;

    return (
      <View style={ styles.indexBar }>
        <Animated.View style={[ styles.indexBarItem, {
          width: constants.width / (this.props.images.length + 1),
          transform: [{
            translateX: this.state.indexBarX
          }]
        }]}/>
      </View>
    );
  },

  render() {
    if(!this.props.isVisible) return null;
    var post = this.props.post;
    var title = post.title || '';
    if(this.state.imageIndex == this.props.images.length) {
      // in gallery view
      title = 'Gallery';
    }

    var imageCards = [];
    for (var key in this.props.images) {
      imageCards.push(
        <ImageOverlayItem
          key={ 'image:' + key }
          image={ this.props.images[key] }
          onPress={ this.hide }
        />
      );
    }

    if(this.props.images.length > 1) {
      imageCards.push(
        <ImageOverlayGallery
          key={ 'image-overlay-gallery' }
          images={ this.props.images }
          onImageSelect={ this.onImageSelect }
        />
      );
    }

    return (
      <Modal
        animated={ true }
        transparent={ true }
        visible={ this.props.isVisible }
      >
        <BlurView
          blurType='dark'
          style={ styles.container }
        >
          <View style={ styles.topBarContainer }>
            <View style={{
              width: constants.width,
              height: constants.getStatusBarHeight(),
              backgroundColor: '#333'
            }}/>
            <View style={ styles.topBar }>
              <TouchableOpacity
                activeOpacity={ 0.5 }
                style={ styles.iconButton }
                onPress={ this.hide }
              >
                <Icon
                  name='close'
                  size={ 30 }
                  color='#fff'
                />
              </TouchableOpacity>
              <View style={ styles.titleContainer }>
                <Text
                  style={ styles.title }
                  numberOfLines={ 1 }
                >
                  { title }
                </Text>
                <Text style={ styles.imageCountText }>
                  { this.props.images.length } Images
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={ 0.5 }
                style={ styles.iconButton }
                onPress={ this.goToGallery }
              >
                <Icon
                  name='view-module'
                  size={ 30 }
                  color='#fff'
                />
              </TouchableOpacity>
            </View>
          </View>
          { this.renderIndexBar() }
          <View style={ styles.swiperContainer }>
            <ScrollView
              ref={ ref => { this.ScrollView = ref; }}
              style={ styles.scrollView }
              horizontal={ true }
              showsVerticalScrollIndicator={ false }
              showsHorizontalScrollIndicator={ false }
              directionalLockEnabled={ true }
              pagingEnabled={ true }
              automaticallyAdjustContentInsets={ false }
              scrollEventThrottle={ 4 }
              onScroll={ this.onScroll }
            >
              { imageCards }
            </ScrollView>
          </View>
        </BlurView>
      </Modal>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  topBarContainer: {
    width: constants.width,
    flexDirection: 'column',
    paddingTop: 0,
    overflow: 'visible',
    backgroundColor: '#333',
  },
  topBar: {
    width: constants.width,
    height: 48,
    marginTop: 0,
    backgroundColor: '#333',
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleContainer: {
    flex: 1,
    height: 48,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  title: {
    color: '#fff',
    fontSize: 17,
    marginBottom: 2
  },
  imageCountText: {
    color: '#ccc',
    fontSize: 14
  },
  iconButton: {
    width: 48,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10
  },
  indexBar: {
    width: constants.width,
    height: 5,
    backgroundColor: '#333',
    flexDirection: 'row',
    alignItems: 'center'
  },
  indexBarItem: {
    height: 5,
    backgroundColor: '#AAA'
  },
  swiperContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});

module.exports = ImageOverlay;

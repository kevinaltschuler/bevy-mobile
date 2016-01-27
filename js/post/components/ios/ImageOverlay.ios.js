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
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var { BlurView } = require('react-native-blur');
var Swiper = require('react-native-swiper');
var ImageOverlayItem = require('./ImageOverlayItem.ios.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var resizeImage = require('./../../../shared/helpers/resizeImage');

var toleranceX = 10;
var toleranceY = 10;

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
      imageIndex: 0
    };
  },

  hide() {
    this.props.onHide();
  },

  render() {
    if(!this.props.isVisible) return null;
    var post = this.props.post;
    var title = post.title || '';
    if(title.length > 40) {
      title = title.substring(0,40);
      title = title.concat('...');
    }

    var imageCount = (this.props.images.length == 1)
    ? <View/>
    : <Text style={ styles.imageCountText }>
        { this.state.imageIndex + 1 }/{ this.props.images.length }
      </Text>;

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
              <Text
                style={ styles.title }
                numberOfLines={ 1 }
              >
                { title }
              </Text>
              <View style={{
                width: 48,
                height: 48
              }}/>
            </View>
          </View>
          <View style={ styles.swiperContainer }>
            <Swiper
              showsButtons={ false }
              dot={ <View style={ styles.dot } /> }
              activeDot={ <View style={ styles.activeDot } /> }
              paginationStyle={ styles.paginationStyle }
              loop={ true }
            >
              { imageCards }
            </Swiper>
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
  title: {
    flex: 1,
    color: '#fff',
    fontSize: 17,
    textAlign: 'center',
    marginHorizontal: 10
  },
  iconButton: {
    width: 48,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center'
  },
  imageCountText: {
    flex: 1,
    color: '#333',
    fontSize: 17,
    textAlign: 'center'
  },
  dot: {
    backgroundColor: 'rgba(255,255,255,.3)',
    width: 13,
    height: 13,
    borderRadius: 7,
    marginLeft: 7,
    marginRight: 7
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 13,
    height: 13,
    borderRadius: 7,
    marginLeft: 7,
    marginRight: 7
  },
  paginationStyle: {
  },
  swiperContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});

module.exports = ImageOverlay;

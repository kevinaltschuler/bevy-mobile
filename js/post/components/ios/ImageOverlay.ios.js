/**
 * ImageOverlay.ios.js
 * @author albert
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
  PanResponder,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var { BlurView, VibrancyView } = require('react-native-blur');
var Swiper = require('react-native-swiper-fork');
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
    post: React.PropTypes.object
  },

  getInitialState() {
    return {
      isVisible: this.props.isVisible,
      imageIndex: 0
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      isVisible: nextProps.isVisible
    });
  },

  onImagePress() {
    this.setState({
      isVisible: false
    });
  },

  render() {
    if(!this.state.isVisible) return null;
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
          onPress={ this.onImagePress }
        />
      );
    }

    return (
      <Modal
        animated={true}
        transparent={true}
        Visible={ this.state.isVisible }
      >
        <View>
          <BlurView blurType='dark' style={ styles.container }>
            <View>
              <View style={ styles.topBar }>
                <Text style={ styles.title }>
                  { title }
                </Text>
              </View>
              <Swiper
                contentContainerStyle={ styles.container }
                showsButtons={ false }
                dot={
                  <View style={{
                    backgroundColor:'rgba(255,255,255,.3)',
                    width: 13,
                    height: 13,
                    borderRadius: 7,
                    marginLeft: 7,
                    marginRight: 7
                  }} />
                }
                activeDot={
                  <View style={{
                    backgroundColor: '#fff',
                    width: 13,
                    height: 13,
                    borderRadius: 7,
                    marginLeft: 7,
                    marginRight: 7
                  }} />
                }
                paginationStyle={{
                  bottom: 70,
                }}
                loop={ true }
              >
                { imageCards }
              </Swiper>
            </View>
          </BlurView>
          <TouchableOpacity
            activeOpacity={.6}
            style={ styles.closeButton }
            onPress={() => {
              this.setState({
                isVisible: false
              });
            }}
          >
            <Icon
              name='close'
              size={ 40 }
              style={{ width: 40, height: 40, fontWeight: 'bold' }}
              color='#fff'
            />
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: constants.width,
    height: constants.height,
    justifyContent: 'center',
    alignItems: 'center'
  },

  blur: {
    flex: 1
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: constants.width,
    height: constants.height,
    opacity: 0.5
  },
  modal: {
    marginTop: 48,
    flexDirection: 'row',
  },
  closeButton: {
    height: 68,
    paddingLeft: 10,
    paddingRight: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginTop: 20,
    position: 'absolute'
  },
  imageCountText: {
    flex: 1,
    color: '#333',
    fontSize: 17,
    textAlign: 'center'
  },

  topBar: {
    position: 'absolute',
    top: 0,
    height: 96,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
    width: constants.width,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    marginTop: 8,
    width: constants.width * .65
  }
});

module.exports = ImageOverlay;

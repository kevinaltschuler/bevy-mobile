/**
 * ImageModal.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  Image,
  Modal,
  PanResponder,
  Animated,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');

var _ = require('underscore');
var constants = require('./../../../constants');

var ImageModal = React.createClass({
  getInitialState() {
    return {
      visible: false,
      imageIndex: 0,
      images: [],
      imageAnim: new Animated.ValueXY()
    };
  },

  componentWillMount() {
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
      },
      onPanResponderMove: (evt, gestureState) => {
        this.state.imageAnim.setValue({
          x: gestureState.dx
        });
      },
      onPanResponderRelease: (evt, gestureState) => {
        if(gestureState.dx == 0) {
          this.dismiss();
          return;
        }
        if(Math.abs(gestureState.dx) > (constants.width / 2) 
          && this.state.images.length > 1) {
          if(gestureState.dx > 0) {
            // prev img
            this.setState({
              imageIndex: (this.state.imageIndex == 0) 
                ? this.state.images.length - 1
                : this.state.imageIndex - 1,
              imageAnim: new Animated.ValueXY()
            });
          } else {
            // next img
            this.setState({
              imageIndex: (this.state.imageIndex == this.state.images.length - 1)
                ? 0
                : this.state.imageIndex + 1,
              imageAnim: new Animated.ValueXY()
            });
          }
        }
        // else {
          Animated.spring(
            this.state.imageAnim,
            { toValue: { x: 0, y: 0 } }
          ).start();
        //}
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      }
    });
  },
  componentDidMount() {
    var actions = {
      show: this.show,
      dismiss: this.dismiss
    };
    constants.setImageModalActions(actions);
  },
  componentWillUnmount() {
  },

  show() {
    var images = constants.getImageModalImages();
    console.log(images);
    this.setState({ visible: true, images: images });
  },

  dismiss() {
    this.setState({ 
      visible: false,
      imageIndex: 0
    });
  },

  render() {
    if(!this.state.visible) return <View />;
    return (
      <View style={ styles.container }>
        <View style={ styles.backdrop } />
        <Animated.View style={[ styles.imageContainer, this.state.imageAnim.getLayout() ]}>
          <Image
            style={ styles.image }
            source={{ uri: this.state.images[this.state.imageIndex] }}
            resizeMode='contain'
          />
        </Animated.View>
        <View { ...this._panResponder.panHandlers } style={ styles.swipeMonkey } />
        <View style={ styles.topBar }>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#666', false) }
            onPress={ this.dismiss }
          >
            <View style={ styles.closeButton }>
              <Icon
                name='close'
                size={ 30 }
                color='#FFF'
              />
            </View>
          </TouchableNativeFeedback>
          <Text style={ styles.imageIndex }>
            { (this.state.imageIndex + 1) + ' of ' + this.state.images.length }
          </Text>
          <Text style={ styles.title }>
            { this.state.images[this.state.imageIndex] }
          </Text>
        </View>
      </View>    
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
  backdrop: {
    backgroundColor: '#000',
    position: 'absolute',
    top: 0,
    left: 0,
    width: constants.width,
    height: constants.height,
    opacity: 0.5
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: constants.width,
    height: constants.height,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    flex: 1,
    width: constants.width
  },
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: constants.width,
    height: constants.height
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 48,
    width: constants.width,
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center'
  },
  closeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 8,
    marginRight: 8
  },
  imageIndex: {
    color: '#FFF',
    marginRight: 16
  },
  title: {
    flex: 1,
    color: '#FFF'
  },
  swipeMonkey: {
    flex: 1,
    width: constants.width,
    height: constants.height,
    backgroundColor: '#F00',
    opacity: 0
  }
});

module.exports = ImageModal;
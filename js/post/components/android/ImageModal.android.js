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
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');

var _ = require('underscore');
var constants = require('./../../../constants');

var ImageModal = React.createClass({
  propTypes: {
    visible: React.PropTypes.bool,
    onDismiss: React.PropTypes.func
  },

  getInitialState() {
    return {
      visible: false,
      imageIndex: 0,
      images: []
    };
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
    this.setState({ visible: false });
  },

  render() {
    if(!this.state.visible) return <View />;
    return (
      <View style={ styles.container }>
        <View style={ styles.backdrop } />
        <Image
          style={ styles.image }
          source={{ uri: this.state.images[this.state.imageIndex] }}
          resizeMode='contain'
        />
        <TouchableWithoutFeedback>
          <View style={ styles.fill } />
        </TouchableWithoutFeedback>
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
  image: {
    flex: 1,
    width: constants.width * .85
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
    color: '#FFF'
  },
});

module.exports = ImageModal;
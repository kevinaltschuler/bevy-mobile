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
  BackAndroid,
  ViewPagerAndroid,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var ImageModalItem = require('./ImageModalItem.android.js');

var _ = require('underscore');
var constants = require('./../../../constants');

var ImageModal = React.createClass({
  getInitialState() {
    return {
      visible: false,
      imageIndex: 0,
      images: []
    };
  },

  componentWillMount() {
  },
  componentDidMount() {
    var actions = {
      show: this.show,
      dismiss: this.dismiss
    };
    constants.setImageModalActions(actions);
    BackAndroid.addEventListener('hardwareBackPress', this.onBackButton);
  },
  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.onBackButton);
  },

  onBackButton() {
    if(this.state.visible) {
      this.setState({
        visible: false
      });
      return true;
    } else return false;
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

  onPageSelected(ev) {
    var index = ev.nativeEvent.position;
    this.setState({
      imageIndex: index
    });
  },

  _renderTopBar() {
    return (
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
    );
  },

  _renderImages() {
    var images = [];
    for(var key in this.state.images) {
      var image_url = this.state.images[key];
      images.push(
        <View 
          key={ 'image:' + key }
          style={{ flex: 1 }}
        >
          <ImageModalItem
            url={ image_url }
          />
        </View>
      );
    }
    return images;
  },

  render() {
    if(!this.state.visible) return <View />;
    return (
      <View style={ styles.container }>
        <TouchableWithoutFeedback onPress={ this.dismiss }>
        <View style={ styles.backdrop } />
        </TouchableWithoutFeedback>
        <ViewPagerAndroid
          ref='Pager'
          style={ styles.imageContainer }
          initialPage={ 0 }
          keyboardDismissMode='on-drag'
          onPageScroll={() => {}}
          onPageSelected={ this.onPageSelected }
        >
          { this._renderImages() }
        </ViewPagerAndroid>
        { this._renderTopBar() }
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
    opacity: 0.75
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
  }
});

module.exports = ImageModal;
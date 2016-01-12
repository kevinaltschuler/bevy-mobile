/**
 * ImageOverlayItem.ios.js
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  Image,
  TouchableWithoutFeedback,
  StyleSheet
} = React;
var Spinner = require('react-native-spinkit');

var _ = require('underscore');
var constants = require('./../../../constants');
var resizeImage = require('./../../../shared/helpers/resizeImage');

var ImageOverlayItem = React.createClass({
  propTypes: {
    image: React.PropTypes.object,
    onPress: React.PropTypes.func
  },

  getInitialState() {
    return {
      loaded: false,
      error: false,
      progress: 0,
      imageURL: (this.props.image.foreign)
        ? this.props.image.path
        //: resizeImage(this.props.image, constants.width, constants.height).url
        : this.props.image.path
    };
  },

  onPress() {
    this.props.onPress();
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
    console.log('load progress', ev.nativeEvent);
  },

  _renderLoading() {
    if(this.state.loaded) return <View />;
    return (
      <View style={ styles.loadingContainer }>
        <Spinner
          isVisible={ true }
          size={ 40 }
          type={ 'Arc' }
          color={ '#2cb673' }
        />
      </View>
    );
  },

  render() {
    return (
      <View style={ styles.container }>
        <Image
          style={ styles.image }
          source={{ uri: this.state.imageURL }}
          resizeMode='contain'
          onLoadStart={ this.onLoadStart }
          onLoad={ this.onLoad }
          onError={ this.onLoadError }
          onProgress={ this.onLoadProgress }
        >
          { this._renderLoading() }
        </Image>
        <TouchableWithoutFeedback
          style={ styles.touchMonkey }
          onPress={ this.onPress }
        >
          <View/>
        </TouchableWithoutFeedback>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0)',
    height: constants.height,
    width: constants.width,
    flexDirection: 'column',
    shadowColor: '#000',
    borderRadius: 20,
  },
  image: {
    flex: 1,
    width: constants.width,
    height: constants.height - 48 - 10 - 10 // top bar plus padding
  },
  loadingContainer: {
    width: constants.width,
    height: constants.height,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  touchMonkey: {
    width: constants.width,
    height: constants.height
  }
});

module.exports = ImageOverlayItem;

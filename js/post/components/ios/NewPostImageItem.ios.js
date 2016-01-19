/**
 * NewPostImageItem.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');

var _ = require('underscore');
var constants = require('./../../../constants');
var resizeImage = require('./../../../shared/helpers/resizeImage');

var NewPostImageItem = React.createClass({
  propTypes: {
    image: React.PropTypes.object,
    onRemove: React.PropTypes.func
  },

  remove() {
    this.props.onRemove(this.props.image);
  },

  showImageModal() {
  },

  render() {
    var imageURL = resizeImage(this.props.image, 128, 128).url;
    return (
      <TouchableWithoutFeedback
        onPress={ this.showImageModal }
      >
        <View style={ styles.container }>
          <Image
            source={{ uri: imageURL }}
            style={ styles.image }
            resizeMode='cover'
          />
          <TouchableOpacity
            onPress={ this.remove }
            style={ styles.closeButton }
          >
            <Icon
              name='close'
              size={ 30 }
              color='#FFF'
            />
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    width: 75,
    height: 75,
    borderRadius: 5,
    marginHorizontal: 5,
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-start'
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 5
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    paddingTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0)'
  }
});

module.exports = NewPostImageItem;

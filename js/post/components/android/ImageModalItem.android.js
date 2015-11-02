/**
 * ImageModalItem.android.js
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  Image,
  StyleSheet
} = React;

var constants = require('./../../../constants');

var ImageModalItem = React.createClass({
  propTypes: {
    url: React.PropTypes.string
  },

  getInitialState() {
    return {
      width: constants.width,
      height: -1,
      adjusted: false // flag to see if we've already adjusted the image
    }
  },

  onLayout(ev) {
    // dont do anything if we've already adjusted the image
    if(this.state.adjusted) return;

    var layout = ev.nativeEvent.layout;
    var width = layout.width;
    var height = layout.height;

    console.log('orig dimensions', width, height);

    if(width >= height) {
      // horizontal or square image
      var ratio = constants.width / width;
      width = constants.width;
      height = height * ratio
    } else {
      // vertical image
      var ratio = (constants.height - 48) / height;
      height = constants.height - 48;
      width = width * ratio;
    }
    console.log('adjusted dimensions', width, height);
    this.setState({
      width: width,
      height: height,
      adjusted: true
    });
  },

  render() {

    var imageStyle = {};
    //if(this.state.width > 0)
    //  imageStyle.width = this.state.width;
    //if(this.state.height > 0)
    //  imageStyle.height = this.state.height;

    return (
      <Image
        style={[ styles.image, imageStyle ]}
        source={{ uri: this.props.url }}
        //onLayout={ this.onLayout }
        resizeMode='contain'
      />
    );
  }
});

var styles = StyleSheet.create({
  image: {
    flex: 1
  }
});

module.exports = ImageModalItem;
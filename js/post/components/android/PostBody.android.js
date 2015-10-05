/**
 * PostBody.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
	View,
  Text,
  TouchableNativeFeedback,
  StyleSheet
} = React;

var MAX_HEIGHT = 150;

var PostBody = React.createClass({
  propTypes: {
    post: React.PropTypes.object
  },

  getInitialState() {
    return {
      width: 0,
      height: 0
    };
  },

  onLayout(ev) {
    var layout = ev.nativeEvent.layout;
    var width = layout.width;
    var height = layout.height;

    this.setState({
      width: width,
      height: height
    });
  },

  _renderText() {
    var textStyle = {};
    if(this.state.height != 0 && this.state.height > MAX_HEIGHT) {
      textStyle.height = MAX_HEIGHT;
    };

    return (
      <Text style={[ styles.postText, textStyle ]}>
        { this.props.post.title }
      </Text>
    );
  },

  _renderExpandButton() {
    if(this.state.height != 0 && this.state.height > MAX_HEIGHT) {
      return (
        <TouchableNativeFeedback
          onPress={() => {
            // go to comment view
          }}
        >
          <View style={ styles.showMoreButton }>
            <Text style={ styles.showMoreButtonText }>Show More</Text>
          </View>
        </TouchableNativeFeedback>
      );
    } else {
      return <View />;
    }
  },

  render() {
    return (
      <View 
        style={ styles.container }
        onLayout={ this.onLayout }
      >
        { this._renderText() } 
        { this._renderExpandButton() }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 12,
    paddingRight: 12
  },
  postText: {
    flex: 1,
    color: '#333',
    textAlign: 'left'
  }
});

module.exports = PostBody;
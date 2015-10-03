/**
 * Post.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet
} = React;

var Post = React.createClass({
  propTypes: {
    post: React.PropTypes.object
  },

  render() {
    return (
      <View style={ styles.container }>
        <Text>Post</Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {

  }
});

module.exports = Post;
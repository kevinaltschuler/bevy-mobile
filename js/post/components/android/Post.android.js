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
var PostHeader = require('./PostHeader.android.js');

var Post = React.createClass({
  propTypes: {
    post: React.PropTypes.object
  },

  render() {
    return (
      <View style={ styles.container }>
        <PostHeader post={ this.props.post } />
        <Text>{ this.props.post.title }</Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#FFF'
  }
});

module.exports = Post;
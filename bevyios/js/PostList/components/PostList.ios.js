/**
 * BevyBar.js
 * kevin made this
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  ScrollView
} = React;

var Post = require('./Post.ios.js');

var PostList = React.createClass({

  render: function() {

    console.log('post list props', this.props);

    var posts = '';

    return (
      <ScrollView style={styles.postContainer}>
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        
      </ScrollView>
    );
  },
});


var styles = StyleSheet.create({
  postContainer: {
    flexDirection: 'column'
  }
})

module.exports = PostList;

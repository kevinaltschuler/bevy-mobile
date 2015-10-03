/**
 * PostList.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  ListView,
  Text,
  StyleSheet
} = React;
var Post = require('./Post.android.js');

var PostList = React.createClass({
  propTypes: {
    allPosts: React.PropTypes.array
  },

  getInitialState() {
    var posts = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    return {
      posts: posts.cloneWithRows(this.props.allPosts)
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      posts: this.state.posts.cloneWithRows(nextProps.allPosts)
    });
  },

  render() {
    return (
      <View style={ styles.container }>
        <Text>Post List</Text>
        <ListView
          dataSource={ this.state.posts }
          style={ styles.postList }
          renderRow={(post) => 
            <Post
              key={ 'post:' + post._id }
              post={ post }
            />
          }
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  postList: {

  }
});

module.exports = PostList;
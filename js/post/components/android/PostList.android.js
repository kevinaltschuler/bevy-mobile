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
var NewPostCard = require('./NewPostCard.android.js');
var Post = require('./Post.android.js');


var PostList = React.createClass({
  propTypes: {
    allPosts: React.PropTypes.array,
    mainNavigator: React.PropTypes.object,
    user: React.PropTypes.object,
    loggedIn: React.PropTypes.bool,
    showNewPostCard: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      allPosts: [],
      showNewPostCard: false
    }
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

  _renderNewPostCard() {
    if(!this.props.showNewPostCard) return <View />;
    else return (
      <NewPostCard
        user={ this.props.user }
        loggedIn={ this.props.loggedIn }
        mainNavigator={ this.props.mainNavigator }
      />
    );
  },

  render() {
    return (
      <View style={ styles.container }>
        <ListView
          dataSource={ this.state.posts }
          style={ styles.postList }
          renderHeader={ this._renderNewPostCard }
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
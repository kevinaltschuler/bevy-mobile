/**
 * Post.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,  
  Text,
  StyleSheet,
  TouchableHighlight,
  Image
} = React;
var PostHeader = require('./PostHeader.android.js');
var PostBody = require('./PostBody.android.js');
var PostActions = require('./PostActions.android.js');

var _ = require('underscore');
var PostStore = require('./../../PostStore');

var Post = React.createClass({
  propTypes: {
    post: React.PropTypes.object,
    mainNavigator: React.PropTypes.object,
    mainRoute: React.PropTypes.object,
    expandText: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      inCommentView: false,
      post: {},
      expandText: false
    };
  },

  getInitialState() {
    return {
      post: this.props.post,
      overlayVisible: false,
      voted: this.props.post.voted
    };
  },

  _renderPostImage() {
    if(_.isEmpty(this.state.post.images)) {
      return <View />;
    }
    var imageCount = this.state.post.images.length;
    var imageCountText = (imageCount > 1) 
    ? (
      <Text style={ styles.postImageCountText }>
        + { imageCount - 1 } more
      </Text>
    )
    : null;

    return (
      <TouchableHighlight
        underlayColor='rgba(0,0,0,0.1)'
        onPress={() => {
          this.setState({
            overlayVisible: true
          });
        }}
      >
        <Image
          style={ styles.postImage }
          source={{ uri: this.state.post.images[0] }}
          resizeMode='cover'
        >
          { imageCountText }
        </Image>
      </TouchableHighlight>
    );
  },

  render() {
    return (
      <View style={ styles.container }>
        <PostHeader post={ this.props.post } />
        <PostBody 
          post={ this.props.post } 
          mainNavigator={ this.props.mainNavigator }
          mainRoute={ this.props.mainRoute }
          expandText={ this.props.expandText }
        />
        { this._renderPostImage() }
        <PostActions 
          post={ this.props.post } 
          mainNavigator={ this.props.mainNavigator }
          mainRoute={ this.props.mainRoute }
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#FFF',
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5
  }
});

module.exports = Post;
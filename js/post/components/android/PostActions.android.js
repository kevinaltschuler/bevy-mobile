/**
 * PostActions.android.js
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
var Icon = require('react-native-vector-icons/MaterialIcons');

var _ = require('underscore');
var constants = require('./../../../constants');
var PostStore = require('./../../PostStore');

var PostActions = React.createClass({
  propTypes: {
    post: React.PropTypes.object
  },

  getLikeCountText() {
    var likeCount = PostStore.getPostVoteCount(this.props.post._id);
    return (likeCount > 1 || likeCount == 0) 
    ? likeCount + ' likes'
    : likeCount + ' like';
  },

  getCommentCountText() {
    var commentCount = this.props.post.comments.length;
    return (commentCount > 1 || commentCount == 0)
    ? commentCount + ' comments'
    : commentCount + ' comment';
  },

  render() {
    return (
      <View style={ styles.container }>
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#CCC', false) }
          onPress={() => {

          }}
        >
          <View style={ styles.likeButton }>
            <Icon
              name='thumb-up'
              size={ 24 }
              color='#AAA'
            />
            <Text style={ styles.likeButtonText }>
              { this.getLikeCountText() }
            </Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#CCC', false) }
          onPress={() => {

          }}
        >
          <View style={ styles.commentButton }>
            <Icon
              name='comment'
              size={ 24 }
              color='#AAA'
            />
            <Text style={ styles.commentButtonText }>
              { this.getCommentCountText() }
            </Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#CCC', false) }
          onPress={() => {

          }}
        >
          <View style={ styles.moreButton }>
            <Icon
              name='more-horiz'
              size={ 24 }
              color='#AAA'
            />
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center'
  },
  likeButton: {
    flex: 2,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 8,
    paddingRight: 8
  },
  likeButtonText: {
    color: '#AAA',
    marginLeft: 4
  },
  commentButton: {
    flex: 2,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 8,
    paddingRight: 8
  },
  commentButtonText: {
    color: '#AAA',
    marginLeft: 4
  },
  moreButton: {
    flex: 1,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 4,
    paddingRight: 4
  }
});

module.exports = PostActions;
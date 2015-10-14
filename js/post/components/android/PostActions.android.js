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
var routes = require('./../../../routes');
var PostStore = require('./../../PostStore');
var $PostActions = require('./../../PostActions');
var UserStore = require('./../../../user/UserStore');

var PostActions = React.createClass({
  propTypes: {
    post: React.PropTypes.object,
    mainNavigator: React.PropTypes.object
  },

  getInitialState() {
    var user = UserStore.getUser();
    var vote = _.findWhere(this.props.post.votes, { voter: user._id });
    return {
      voted: (vote != undefined && vote.score > 0)
    };
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
          background={ TouchableNativeFeedback.Ripple('#EEE', false) }
          onPress={() => {
            $PostActions.vote(this.props.post._id);
            this.setState({
              voted: !this.state.voted
            });
          }}
        >
          <View style={ styles.likeButton }>
            <Icon
              name='thumb-up'
              size={ 24 }
              color={(this.state.voted) ? '#666' : '#AAA'}
            />
            <Text style={[styles.likeButtonText, { color: (this.state.voted) ? '#666' : '#AAA' }]}>
              { this.getLikeCountText() }
            </Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#EEE', false) }
          onPress={() => {
            // dont navigate if already in comment view
            if(this.props.mainRoute.name == routes.MAIN.COMMENT.name) return;
            // navigate to comments
            var commentRoute = routes.MAIN.COMMENT;
            commentRoute.post = this.props.post;
            this.props.mainNavigator.push(commentRoute);
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
          background={ TouchableNativeFeedback.Ripple('#EEE', false) }
          onPress={() => {

          }}
        >
          <View style={ styles.moreButton }>
            <Icon
              name='more-vert'
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
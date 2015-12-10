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
  ToastAndroid,
  StyleSheet
} = React;
var Icon = require('./../../../shared/components/android/Icon.android.js');
var DialogAndroid = require('react-native-dialogs');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var PostStore = require('./../../PostStore');
var $PostActions = require('./../../PostActions');
var UserStore = require('./../../../user/UserStore');
var BevyActions = require('./../../../bevy/BevyActions');

var PostActions = React.createClass({
  propTypes: {
    post: React.PropTypes.object,
    mainNavigator: React.PropTypes.object,
    user: React.PropTypes.object,
    loggedIn: React.PropTypes.bool,
    activeBevy: React.PropTypes.object
  },

  getInitialState() {
    if(_.isEmpty(this.props.user)) return {
      voted: false
    };
    var vote = _.findWhere(this.props.post.votes, { voter: this.props.user._id });
    return {
      voted: (vote != undefined && vote.score > 0)
    };
  },

  goToAuthorProfile() {
    var profileRoute = routes.MAIN.PROFILE;
    profileRoute.user = this.props.post.author;
    this.props.mainNavigator.push(profileRoute);
  },

  goToCommentView() {
    // dont navigate if already in comment view
    if(this.props.mainRoute.name == routes.MAIN.COMMENT.name) return;
    // navigate to comments
    var commentRoute = routes.MAIN.COMMENT;
    commentRoute.post = this.props.post;
    this.props.mainNavigator.push(commentRoute);
  },

  goToBevy() {
    // already in the bevy
    if(this.props.post.bevy._id == this.props.activeBevy._id) return;
    // call action
    BevyActions.switchBevy(this.props.post.bevy._id);
  },

  vote() {
    if(!this.props.loggedIn) {
      ToastAndroid.show('Please Log In To Vote', ToastAndroid.SHORT);
    }
    $PostActions.vote(this.props.post._id);
    this.setState({
      voted: !this.state.voted
    });
  },

  goToEditView() {
    var route = routes.MAIN.NEWPOST;
    route.editing = true;
    route.post = this.props.post;
    this.props.mainNavigator.push(route);
  },

  deletePost() {
    if(this.props.user._id == this.props.post.author._id // if the original author
      || _.contains(this.props.post.bevy.admins, this.props.user._id) // if an admin of the bevy
    ) {
      $PostActions.destroy(this.props.post._id);
    } else {
      ToastAndroid.show('You do not have the permissions to do that', ToastAndroid.SHORT);
    }
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

  showMoreActions() {
    var dialog = new DialogAndroid();
    dialog.set({
      title: 'Post Actions',
      items: [
        'Go To Author Profile',
        'Go To Bevy',
        'Edit Post',
        'Delete Post'
      ],
      cancelable: true,
      itemsCallback: (index, item) => {
        switch(index) {
          case 0:
            this.goToAuthorProfile();
            break;
          case 1:
            this.goToBevy();
            break;
          case 2:
            this.goToEditView();
            break;
          case 3:
            this.deletePost();
            break;
        }
      }
    });
    dialog.show();
  },

  render() {
    return (
      <View style={ styles.container }>
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#EEE', false) }
          onPress={ this.vote }
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
          onPress={ this.goToCommentView }
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
          onPress={ this.showMoreActions }
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

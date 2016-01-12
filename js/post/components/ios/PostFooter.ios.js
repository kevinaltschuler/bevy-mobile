/**
 * PostFooter.ios.js
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  TouchableHighlight,
  TouchableOpacity,
  Text,
  ActionSheetIOS,
  AlertIOS,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons')

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var PostActions = require('./../../../post/PostActions');
var BevyActions = require('./../../../bevy/BevyActions');
var BoardActions = require('./../../../board/BoardActions');

var PostFooter = React.createClass({
  propTypes: {
    post: React.PropTypes.object,
    user: React.PropTypes.object,
    inCommentView: React.PropTypes.bool,
    mainNavigator: React.PropTypes.object,
    mainRoute: React.PropTypes.object
  },
  getInitialState() {
    return {
      voted: this.props.post.voted,
      isAuthor: this.props.user._id == this.props.post.author._id,
      isAdmin: _.contains(this.props.post.board.admins, this.props.user._id)
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      voted: nextProps.post.voted,
      isAuthor: nextProps.user._id == nextProps.post.author._id,
      isAdmin: _.contains(nextProps.post.board.admins, nextProps.user._id)
    });
  },

  openActionSheet() {
    var options = [
      'Cancel',
      'View ' + this.props.post.author.displayName + "'s Profile",
      'Go To Board "' + this.props.post.board.name + '"'
    ];
    if(this.state.isAdmin || this.state.isAuthor) {
      options.push('Edit Post');
      options.push('Delete Post');
    }

    ActionSheetIOS.showActionSheetWithOptions({
      options: options,
      cancelButtonIndex: 0,
      destructiveButtonIndex: 4
    }, buttonIndex => {
      switch(buttonIndex) {
        case 1:
          this.goToAuthorProfile();
          break;
        case 2:
          this.goToPostBoard();
          break;
        case 3:
          // edit Post
          break;
        case 4:
          this.destroyPost();
          break;
      }
    });
  },

  destroyPost() {
    AlertIOS.alert(
      'Are You Sure?',
      'Deleting this post will also delete all of its accumulated votes and comments',
      [{
        text: 'Delete Post',
        onPress: this.destroyPostForSure,
        type: 'default'
      }, {
        text: 'Cancel',
        type: 'cancel'
      }]
    );
  },

  destroyPostForSure() {
    PostActions.destroy(this.props.post._id);
  },

  goToAuthorProfile() {
    if(this.props.mainRoute.name == routes.MAIN.PROFILE.name
      && this.props.mainRoute.profileUser._id == this.props.post.author._id) {
      // we're already viewing the author's profile, do nothing
      return;
    }

    var route = routes.MAIN.PROFILE;
    route.profileUser = this.props.post.author;
    this.props.mainNavigator.push(route);
  },

  goToPostBoard() {
    //console.log(this.props.mainNavigator.getCurrentRoutes());

    if(this.props.mainRoute.name == routes.MAIN.BEVYNAV.name) {
      // already in bevy view, do nothing
    } else if (_.findWhere(this.props.mainNavigator.getCurrentRoutes(),
      { name: routes.MAIN.BEVYNAV.name }) != undefined) {
      // the bevy nav route is somewhere back in the route stack
      // so lets pop to it
      this.props.mainNavigator.popToRoute(routes.MAIN.BEVYNAV);
    } else {
      // the route isn't in the history, so push to it
      this.props.mainNavigator.push(routes.MAIN.BEVYNAV);
    }

    // switch bevies
    BevyActions.switchBevy(this.props.post.board.parent);
    // switch boards
    BoardActions.switchBoard(this.props.post.board._id);
  },

  goToCommentView() {
    // go to comment view
    // return if we're already in comment view
    if(this.props.inCommentView) return;

    var commentRoute = routes.MAIN.COMMENT;
    commentRoute.postID = this.state.post._id;
    this.props.mainNavigator.push(commentRoute);
  },

  vote() {
    PostActions.vote(post._id);
    this.setState({
      voted: !this.state.voted,
      overlayVisible: false
    });
  },

  countVotes: function() {
    var sum = 0;
    this.props.post.votes.forEach(vote => {
      sum += vote.score;
    });
    return sum;
  },

  render() {
    return (
      <View style={ styles.postActionsRow }>
        <TouchableHighlight
          underlayColor='rgba(0,0,0,0.1)'
          style={[ styles.actionTouchable, { flex: 2 } ]}
          onPress={ this.vote }
        >
          <View style={[ styles.actionTouchable, { flex: 1 } ]}>
            <Text style={ styles.pointCountText }>
              { this.countVotes() }
            </Text>
            <Icon
              name={ 'thumb-up' }
              size={ 20 }
              color={ (this.state.voted) ? '#2CB673' : 'rgba(0,0,0,.35)' }
              style={ styles.actionIcon }
            />
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor='rgba(0,0,0,0.1)'
          style={[ styles.actionTouchable, { flex: 2 } ]}
          onPress={ this.goToCommentView }
        >
          <View style={[ styles.actionTouchable, { flex: 1 } ]}>
            <Text style={ styles.commentCountText }>
              { this.props.post.comments.length }
            </Text>
            <Icon
              name='chat-bubble'
              size={ 20 }
              color='rgba(0,0,0,.3)'
              style={ styles.actionIcon }
            />
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor='rgba(0,0,0,0.1)'
          style={[ styles.actionTouchable, { flex: 1 } ]}
          onPress={ this.openActionSheet }
        >
          <Icon
            name='more-horiz'
            size={ 20 }
            color='rgba(0,0,0,.3)'
            style={ styles.actionIcon }
          />
        </TouchableHighlight>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  postActionsRow: {
    height: 36,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  pointCountText: {
    color: '#757d83',
    fontSize: 15,
    marginRight: 10
  },
  commentCountText: {
    color: '#757d83',
    fontSize: 15,
    marginRight: 10
  },
  actionTouchable: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 36
  },
  actionIcon: {
    width: 20,
    height: 20
  },
});

module.exports = PostFooter;

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
var BoardActions = require('./../../../bevy/BoardActions');

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
          this.goToEditPost();
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
    this.props.mainNavigator.pop();
  },

  goToEditPost() {
    var route = {
      name: routes.MAIN.EDITPOST,
      post: this.props.post
    };
    this.props.mainNavigator.push(route);
  },

  goToAuthorProfile() {
    if(this.props.mainRoute.name == routes.MAIN.PROFILE.name
      && this.props.mainRoute.profileUser._id == this.props.post.author._id) {
      // we're already viewing the author's profile, do nothing
      return;
    }

    var route = {
      name: routes.MAIN.PROFILE,
      profileUser: this.props.post.author
    };
    this.props.mainNavigator.push(route);
  },

  goToPostBoard() {
    //console.log(this.props.mainNavigator.getCurrentRoutes());

    if(this.props.mainRoute.name == routes.MAIN.BEVY) {
      // already in bevy view, do nothing
    } else {
      // the route isn't in the history, so push to it
      var route = {
        name: routes.MAIN.BEVY
      };
      this.props.mainNavigator.push(route);
    }
    
    // switch boards
    BoardActions.switchBoard(this.props.post.board._id);
  },

  goToCommentView() {
    // go to comment view
    // return if we're already in comment view
    if(this.props.inCommentView) return;

    var route = {
      name: routes.MAIN.COMMENT,
      post: this.props.post
    };
    this.props.mainNavigator.push(route);
  },

  vote() {
    PostActions.vote(this.props.post._id);
    //this.setState({
    //  voted: !this.state.voted
    //});
  },

  render() {
    return (
      <View style={ styles.postActionsRow }>
        <TouchableOpacity
          activeOpacity={ 0.5 }
          style={[ styles.actionTouchable, { flex: 2 } ]}
          onPress={ this.vote }
        >
          <View style={[ styles.actionTouchable, { flex: 1 } ]}>
            <Text numberOfLines={ 1 } style={[ styles.pointCountText, {
              color: (this.state.voted) ? '#2CB673' : 'rgba(0,0,0,.35)'
            }]}>
              { this.props.post.voteCount }
            </Text>
            <Icon
              name={ 'thumb-up' }
              size={ 20 }
              color={ (this.state.voted) ? '#2CB673' : 'rgba(0,0,0,.35)' }
              style={{ marginBottom: 2 }}
            />
            <Text numberOfLines={ 1 } style={[ styles.buttonText, {
              color: (this.state.voted) ? '#2CB673' : 'rgba(0,0,0,.35)'
            }]}>
              {(this.props.post.voteCount == 1) ? 'Like' : 'Likes' }
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={ 0.5 }
          style={[ styles.actionTouchable, { flex: 2 } ]}
          onPress={ this.goToCommentView }
        >
          <View style={[ styles.actionTouchable, { flex: 1 } ]}>
            <Text numberOfLines={ 1 } style={ styles.commentCountText }>
              { this.props.post.commentCount }
            </Text>
            <Icon
              name='chat-bubble'
              size={ 20 }
              color='rgba(0,0,0,.3)'
              style={{ marginTop: 3 }}
            />
            <Text numberOfLines={ 1 } style={ styles.buttonText }>
              {(this.props.post.commentCount == 1) ? 'Comment' : 'Comments' }
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={ 0.5 }
          style={[ styles.actionTouchable, { flex: 1 } ]}
          onPress={ this.openActionSheet }
        >
          <Icon
            name='more-vert'
            size={ 24 }
            color='rgba(0,0,0,.3)'
            style={ styles.actionIcon }
          />
        </TouchableOpacity>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  postActionsRow: {
    height: 48,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#EEE'
  },
  pointCountText: {
    color: '#757d83',
    fontSize: 15,
    marginRight: 6
  },
  commentCountText: {
    color: '#757d83',
    fontSize: 15,
    marginRight: 6
  },
  buttonText: {
    color: '#757d83',
    fontSize: 15,
    marginLeft: 6
  },
  actionTouchable: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48
  },
});

module.exports = PostFooter;

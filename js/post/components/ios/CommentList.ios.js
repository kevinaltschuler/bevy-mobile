/**
 * CommentList.ios.js
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  AlertIOS,
  ActionSheetIOS,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var Collapsible = require('react-native-collapsible');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var timeAgo = require('./../../../shared/helpers/timeAgo');
var CommentActions = require('./../../../post/CommentActions');
// bleached rainbow for adobe color
var colorMap = [
  '#97FF80', '#52C0FF', '#9A5DE8', '#FF5757', '#E8A341'
];

var CommentItem = React.createClass({
  propTypes: {
    comment: React.PropTypes.object,
    onReply: React.PropTypes.func,
    user: React.PropTypes.object,
    mainNavigator: React.PropTypes.object
  },

  getInitialState() {
    return {
      collapsed: true,
      isCompact: false,
      isAuthor: this.props.comment.author._id == this.props.user._id,
      commentBody: this.props.comment.body,
      deleted: false
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      isAuthor: nextProps.comment.author._id == nextProps.user._id,
      commentBody: nextProps.comment.body
    });
  },

  onPress() {
    if(this.state.isCompact)
      this.setState({ isCompact: false });
    else
      this.setState({ collapsed: !this.state.collapsed });
  },

  toggleCompact() {
    this.setState({ isCompact: !this.state.isCompact })
  },

  goToAuthorProfile() {
    var route = routes.MAIN.PROFILE;
    route.profileUser = this.props.comment.author;
    this.props.mainNavigator.push(route);
  },

  editComment() {
    AlertIOS.prompt(
      'Edit Comment',
      null,
      [{
        text: 'Save',
        onPress: this.saveComment,
        style: 'cancel'
      }, {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel'
      }],
      'plain-text',
      this.state.commentBody
    );
  },

  saveComment(body) {
    this.setState({
      commentBody: body
    });
    CommentActions.edit(this.props.comment._id, body);
  },

  deleteComment() {
    AlertIOS.alert(
      'Are you sure?',
      'Deleting a comment will remove all comments under it',
      [{
        text: 'Confirm',
        onPress: this.deleteCommentForSure
      }, {
        text: 'Cancel',
        style: 'cancel'
      }]
    );
  },

  deleteCommentForSure() {
    this.setState({
      deleted: true,
      collapsed: true
    });
    CommentActions.destroy(this.props.comment.postId, this.props.comment._id);
  },

  onReply() {
    // bubble this comment up
    this.props.onReply(this.props.comment);
    // unselect self
    this.setState({ collapsed: true });
  },

  _renderCommentList() {
    if(_.isEmpty(this.props.comment.comments) || this.state.isCompact) return <View />;
    return (
      <CommentList
        comments={ this.props.comment.comments }
        onReply={ this.props.onReply }
        mainNavigator={ this.props.mainNavigator }
        user={ this.props.user }
      />
    );
  },

  _renderCommentBody() {

    if(this.state.deleted) {
      return <View/>;
    }

    var commentStyle = {};
    commentStyle.borderLeftColor =
      (this.props.comment.depth == 0)
       ? 'transparent'
       : colorMap[(this.props.comment.depth - 1) % colorMap.length];
    commentStyle.borderLeftWidth =
      (this.props.comment.depth == 0)
      ? 0
      : (this.props.comment.depth) * 5;
    commentStyle.backgroundColor =
      (this.state.showActionBar)
      ? '#eee'
      : '#fff';
    commentStyle.height = 40;

    var borderLeftWidth = (this.props.comment.depth == 0)
      ? 0
      : (this.props.comment.depth) * 10;

    if(!this.state.collapsed) {
      borderLeftWidth = 0;
    }

    if(this.state.isCompact) {
      return (
        <View style={[ styles.commentItem, commentStyle ]}>
            <View style={ styles.header }>
              <Icon
                name='add'
                size={ 20 }
                color='#AAA'
                style={ styles.plusIcon }
              />
              <Text style={ styles.author }>
                { this.props.comment.author.displayName }
              </Text>
              <Text style={ styles.timeAgo }>
                { timeAgo(Date.parse(this.props.comment.created)) }
              </Text>
            </View>
          </View>
        );
      }
    else {
      return (
        <View style={[ styles.commentItem, {
          //marginLeft: (this.props.comment.depth == 0)
          //  ? 0
          //  : (this.props.comment.depth - 1) * 3,
          backgroundColor: (this.state.collapsed) ? '#fff' : 'rgba(44,182,115,.05)',
          borderLeftColor: (this.props.comment.depth == 0)
            ? 'transparent'
            : colorMap[(this.props.comment.depth - 1) % colorMap.length],
          borderLeftWidth: borderLeftWidth
        }]}>
          <View style={ styles.commentItemTop }>
            <Text style={ styles.commentItemAuthor }>
              { this.props.comment.author.displayName }
            </Text>
            <Text style={ styles.commentItemDetails }>
              { timeAgo(Date.parse(this.props.comment.created)) }
            </Text>
          </View>
          <View style={ styles.commentItemBody }>
            <Text style={ styles.commentItemBodyText }>
              { this.state.commentBody.trim() }
            </Text>
          </View>
        </View>
      );
    }
  },

  _renderEditButton() {
    if(!this.state.isAuthor) return <View />;
    return (
      <TouchableOpacity
        activeOpacity={ 0.5 }
        onPress={ this.editComment }
      >
        <View style={ styles.commentItemAction }>
          <Icon
            name='edit'
            size={ 30 }
            color='#fff'
          />
          <View style={styles.actionRight}>
            <Text style={ styles.commentItemActionText }>
              Edit Comment
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  },

  _renderDeleteButton() {
    if(!this.state.isAuthor) return <View />;
    return (
      <TouchableOpacity
        activeOpacity={ 0.5 }
        onPress={ this.deleteComment }
      >
        <View style={ styles.commentItemAction }>
          <Icon
            name='delete'
            size={ 30 }
            color='#fff'
          />
            <View style={styles.actionRight}>
              <Text style={ styles.commentItemActionText }>
                Delete Comment
              </Text>
            </View>
        </View>
      </TouchableOpacity>
    );
  },

  render() {
    return (
      <View>
        <View style={ styles.commentItemComments }>
          <TouchableHighlight
            underlayColor='rgba(0,0,0,0.1)'
            onPress={ this.onPress }
            delayLongPress={ 750 }
            onLongPress={ this.toggleCompact }
          >
            { this._renderCommentBody() }
          </TouchableHighlight>
          <Collapsible collapsed={this.state.collapsed} >
            <View style={ styles.commentItemActions }>
              <TouchableOpacity
                activeOpacity={ 0.5 }
                onPress={ this.onReply }
              >
                <View style={ styles.commentItemAction }>
                  <Icon
                    name='reply'
                    size={ 30 }
                    color='#fff'
                  />
                  <View style={styles.actionRight}>
                    <Text style={ styles.commentItemActionText }>
                      Reply To Comment
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={ 0.5 }
                onPress={ this.goToAuthorProfile }
              >
                <View style={ styles.commentItemAction }>
                  <Icon
                    name='person'
                    size={ 30 }
                    color='#fff'
                  />
                  <View style={styles.actionRight}>
                    <Text style={ styles.commentItemActionText }>
                      View { this.props.comment.author.displayName }'s Profile
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              { this._renderEditButton() }
              { this._renderDeleteButton() }
            </View>
          </Collapsible>
        </View>
        <View>
          { this._renderCommentList() }
        </View>
      </View>
    );
  }
});

var CommentList = React.createClass({
  propTypes: {
    comments: React.PropTypes.array,
    onReply: React.PropTypes.func,
    user: React.PropTypes.object,
    mainNavigator: React.PropTypes.object
  },

  getDefaultProps() {
    comments: []
  },

  render() {
    return (
      <View style={ styles.commentList }>
        { _.map(this.props.comments, function(comment) {
          return (
            <CommentItem
              key={ 'comment:' + comment._id }
              comment={ comment }
              onReply={ this.props.onReply }
              mainNavigator={ this.props.mainNavigator }
              user={ this.props.user }
            />
          );
        }.bind(this)) }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  commentList: {
    flexDirection: 'column'
  },
  commentItem: {
    flexDirection: 'column',
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE'
  },
  commentItemTop: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  commentItemAuthor: {
    color: '#282828',
    fontSize: 17,
    marginRight: 5
  },
  commentItemDetails: {
    fontSize: 15,
    color: '#888'
  },
  commentItemBody: {
    flex: 1
  },
  commentItemBodyText: {
    fontSize: 17,
    color: '#666'
  },
  commentItemComments: {

  },
  commentItemActions: {
    flexDirection: 'column',
    backgroundColor: '#2CB673',
  },
  commentItemAction: {
    height: 48,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  commentItemActionText: {
    fontSize: 15,
    color: '#FFF',
    marginLeft: 0,
    borderBottomWidth: 1,
  },
  actionRight: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,.3)',
    flex: 1,
    height: 48,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 20
  },
  plusIcon: {
    marginRight: 8
  },
  author: {
    fontSize: 17,
    marginRight: 4,
    color: '#888'
  },
  timeAgo: {
    color: '#AAA'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12
  },
});

module.exports = CommentList;

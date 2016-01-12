/**
 * CommentView.ios.js
 * @author albert
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  DeviceEventEmitter
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var Post = require('./Post.ios.js');
var Event = require('./Event.ios.js');
var CommentList = require('./CommentList.ios.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var PostStore = require('./../../../post/PostStore');
var CommentActions = require('./../../../post/CommentActions');
var StatusBarSizeIOS = require('react-native-status-bar-size');

var CommentView = React.createClass({
  propTypes: {
    postID: React.PropTypes.string,
    user: React.PropTypes.object,
    loggedIn: React.PropTypes.bool,
    mainNavigator: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      postID: '-1'
    };
  },

  getInitialState() {
    var post = PostStore.getPost(this.props.postID);
    if(_.isEmpty(post)) {
      this.setState({
        loading: true
      });
      fetch(constants.apiurl + '/posts/' + this.props.postID)
      .then(res => res.json())
      .then(res => {
        this.setState({
          post: res,
          comments: this.nestComments(post.comments),
          loading: false
        });
      });
    }
    var comments = this.nestComments(post.comments);
    return {
      post: post,
      comments: comments,
      replyToComment: {},
      replyText: '',
      keyboardSpace: 0,
      loading: false
    };
  },

  componentDidMount() {
    DeviceEventEmitter.addListener('keyboardDidShow', this._onKeyboardShow);
    DeviceEventEmitter.addListener('keyboardWillHide', this._onKeyboardHide);
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      post: nextProps.post,
      comments: this.nestComments(nextProps.post.comments)
    });
  },

  _onKeyboardShow(ev) {
    var height = (ev.end) ? ev.end.height : ev.endCoordinates.height;
    this.setState({
      keyboardSpace: height
    });
  },

  _onKeyboardHide(ev) {
    this.setState({
      keyboardSpace: 0
    });
  },

  goBack() {
    this.props.mainNavigator.pop();
  },

  onReply(comment) {
    // rerender with this comment reply active
    this.setState({
      replyToComment: comment
    });
    // focus the text field
    this.refs.reply.focus();
  },

  onReplyBlur() {
    // cancel the comment reply if unfocused
    if(!_.isEmpty(this.state.replyToComment)) {
      this.setState({
        replyToComment: {},
        replyText: this.state.replyText // set again because of set state lag
      });
    }
  },

  onReplyChange(text) {
    this.setState({ replyText: text });
  },

  postReply() {
    var text = this.state.replyText;
    // dont post empty reply
    if(_.isEmpty(text)) {
      this.setState({
        replyText: ''
      });
      return;
    };
    var user = this.props.user;

    // call action
    CommentActions.create(
      text, // body
      user._id, // author id
      this.state.post._id, // post id
      (_.isEmpty(this.state.replyToComment)) ? null : this.state.replyToComment._id // parent id
    );

    // optimistic update
    var comment = {
      _id: Date.now(), // temp id
      author: user,
      body: text,
      postId: this.state.post,
      parentId: (_.isEmpty(this.state.replyToComment)) ? null : this.state.replyToComment._id,
      created: (new Date()).toString(),
      comments: []
    };
    var comments = this.state.post.comments;
    comments.push(comment);
    comments = this.nestComments(comments);
    this.setState({
      replyText: '', // clear comment field
      comments: comments
    });

    // blur reply input
    // buffer delay it so it blurs only when the set state clears up
    setTimeout(
      () => this.refs.reply.blur(), // this also clears the replyToComment state field
      100
    );
  },

  nestComments(comments, parentId, depth) {
    // increment depth (used for indenting later)
    if(typeof depth === 'number') depth++;
    else depth = 0;
    if(_.isEmpty(comments)) return;
    if(comments.length < 0) return []; // return if it's the end of the line

    var $comments = [];
    comments.forEach(function(comment, index) {
      // look for comments under this one
      if(comment.parentId == parentId) {
        comment.depth = depth;
        // and keep going
        comment.comments = this.nestComments(comments, comment._id, depth);
        $comments.push(comment);
        // TODO: splice the matched comment out of the list so we can go faster
      }
    }.bind(this));

    return $comments;
  },

  _renderPost() {
    if(_.isEmpty(this.state.post)) {
      return null;
    }
    if(this.state.post.type == 'event') {
      return (
        <View style={{marginTop: 0}}>
          <Event
            inCommentView={ true }
            post={ this.state.post }
            mainNavigator={ this.props.mainNavigator }
            mainRoute={ this.props.mainRoute }
            user={ this.props.user }
          />
        </View>
      )
    }
    return (
      <View style={{marginTop: 5}}>
        <Post
          inCommentView={ true }
          post={ this.state.post }
          mainNavigator={ this.props.mainNavigator }
          mainRoute={ this.props.mainRoute }
          user={ this.props.user }
        />
      </View>
    );
  },

  _renderNoCommentsText() {
    var text = <Text style={ styles.noCommentsText }> No Comments Yet! </Text>;
    if(_.isEmpty(this.state.comments))
      return text;
    if(this.state.comments.length <= 0)
      return text;
    return null;
  },

  _renderReplyBar() {
    var replyInfo = (_.isEmpty(this.state.replyToComment))
    ? <View />
    : (
      <View style={ styles.replyInfo }>
        <Text style={ styles.replyingTo }>
          Replying to...
        </Text>
        <Text style={ styles.replyAuthor }>
          { this.state.replyToComment.author.displayName }:
        </Text>
        <Text style={ styles.replyBody }>
          { this.state.replyToComment.body.trim() }
        </Text>
      </View>
    );

    return (
      <View
        style={{
          position: 'absolute',
          width: constants.width,
          bottom: this.state.keyboardSpace
        }}
      >
        { replyInfo }
        <View style={ styles.replyBar }>
          <TextInput
            ref='reply'
            style={ styles.replyInput }
            placeholder='Reply'
            returnKeyType='send'
            clearButtonMode='while-editing'
            value={ this.state.replyText }
            onChangeText={ this.onReplyChange }
            onSubmitEditing={ this.postReply }
            onBlur={ this.onReplyBlur }
          />
          <TouchableOpacity
            activeOpacity={ 0.5 }
            onPress={ this.postReply }
            style={ styles.replyButton }
          >
            <Icon
              name='send'
              size={ 30 }
              color='#2CB673'
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  },

  _renderContent() {
    if(this.state.loading) {
      return (
        <View>
          <Text>Loading</Text>
        </View>
      );
    }
    if(_.isEmpty(this.state.post)) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{color: '#555', fontWeight: '600'}}>
            post was not found
          </Text>
        </View>
      );
    }
    return (
      <ScrollView style={ styles.scrollView }>
        { this._renderPost() }
        <Text style={ styles.commentsTitle }>
          Comments
        </Text>
        <View style={ styles.commentsCard }>
          <CommentList
            comments={ this.state.comments }
            onReply={ this.onReply }
            mainNavigator={ this.props.mainNavigator }
          />
          { this._renderNoCommentsText() }
        </View>
      </ScrollView>
    );
  },

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.topBarContainer }>
          <View style={{
            height: StatusBarSizeIOS.currentHeight,
            backgroundColor: '#2CB673'
          }}/>
          <View style={ styles.topBar }>
            <TouchableOpacity
              activeOpacity={ 0.5 }
              style={ styles.iconButton }
              onPress={ this.goBack }
            >
              <Icon
                name='arrow-back'
                size={ 30 }
                color='#FFF'
              />
            </TouchableOpacity>
            <Text style={ styles.title }>
              Post
            </Text>
            <View style={{
              width: 48,
              height: 48
            }}/>
          </View>
        </View>
        { this._renderContent() }
        { this._renderReplyBar() }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#eee',
    marginTop: 0
  },
  topBarContainer: {
    flexDirection: 'column',
    paddingTop: 0,
    overflow: 'visible',
    backgroundColor: '#2CB673',
  },
  topBar: {
    height: 48,
    backgroundColor: '#2CB673',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 17,
    textAlign: 'center',
    color: '#FFF'
  },
  iconButton: {
    width: 48,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

  scrollView: {
    flex: 1
  },
  commentsTitle: {
    fontSize: 17,
    color: '#AAA',
    marginTop: 5,
    marginLeft: 10
  },
  commentsCard: {
    flexDirection: 'column',
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: 'white'
  },

  noCommentsText: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 17,
    color: '#888'
  },

  reply: {
    flexDirection: 'column',
    borderTopColor: "#ccc",
    borderTopWidth: 1
  },
  replyInfo: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#2CB673',
    paddingLeft: 10,
    paddingRight: 10
  },
  replyingTo: {
    fontSize: 12,
    color: '#fff',
    marginRight: 5
  },
  replyAuthor: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 5
  },
  replyBody: {
    fontSize: 12,
    color: '#fff'
  },
  replyBar: {
    backgroundColor: '#fff',
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10
  },
  replyInput: {
    flex: 1,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    height: 38,
    marginTop: 4,
    paddingLeft: 16,
    paddingRight: 16
  },
  replyButton: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 8
  },
  replyButtonText: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 0,
    fontSize: 17,
    color: '#2CB673',
    fontWeight: 'bold',
    marginBottom: 0,
    marginLeft: 5
  }
});

module.exports = CommentView;

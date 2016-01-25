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
  RefreshControl,
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

var CommentView = React.createClass({
  propTypes: {
    post: React.PropTypes.object,
    user: React.PropTypes.object,
    loggedIn: React.PropTypes.bool,
    mainNavigator: React.PropTypes.object
  },

  getInitialState() {
    var post = this.props.post;
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
    DeviceEventEmitter.addListener('keyboardWillShow', this.onKeyboardShow);
    DeviceEventEmitter.addListener('keyboardWillHide', this.onKeyboardHide);
  },
  componentWillUnmount() {
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      post: nextProps.post,
      comments: this.nestComments(nextProps.post.comments)
    });
  },

  onKeyboardShow(ev) {
    var height = (ev.end) ? ev.end.height : ev.endCoordinates.height;
    this.setState({ keyboardSpace: height });
  },

  onKeyboardHide(ev) {
    this.setState({ keyboardSpace: 0 });
  },

  onRefresh() {
    this.setState({ loading: true });
    fetch(constants.apiurl + '/posts/' + this.props.post._id)
    .then(res => res.json())
    .then(res => {
      this.setState({
        post: res,
        comments: this.nestComments(res.comments),
        loading: false
      });
    })
    .catch(err => {
      this.setState({ loading: false });
    })
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
    this.ReplyInput.focus();
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

  postReply() {
    var text = this.state.replyText;
    // dont post empty reply
    if(_.isEmpty(text)) {
      this.setState({ replyText: '' });
      return;
    };

    // call action
    CommentActions.create(
      text, // body
      this.props.user._id, // author id
      this.state.post._id, // post id
      (_.isEmpty(this.state.replyToComment)) ? null : this.state.replyToComment._id, // parent id
      this.props.post //post object
    );

    // optimistic update
    var comment = {
      _id: Date.now(), // temp id
      author: this.props.user,
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

    setTimeout(this.ReplyInput.blur, 500);
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

  _renderReplyInfo() {
    if(_.isEmpty(this.state.replyToComment)) {
      return <View />;
    }

    return (
      <View style={ styles.replyInfo }>
        <Text style={ styles.replyingTo }>
          Replying to:
        </Text>
        <Text style={ styles.replyAuthor }>
          { this.state.replyToComment.author.displayName }:
        </Text>
        <Text style={ styles.replyBody }>
          { this.state.replyToComment.body.trim() }
        </Text>
      </View>
    );
  },

  _renderContent() {
    if(_.isEmpty(this.state.post)) {
      return (
        <View style={ styles.notFoundContainer }>
          <Text style={ styles.notFoundText }>
            Post Not Found
          </Text>
        </View>
      );
    }
    return (
      <ScrollView
        ref={ ref => { this.ScrollView = ref; }}
        style={[ styles.scrollView, {
          marginBottom: this.state.keyboardSpace + 48
        }]}
        refreshControl={
          <RefreshControl
            refreshing={ this.state.loading }
            onRefresh={ this.onRefresh }
            tintColor='#AAA'
            title='Loading...'
          />
        }
      >
        { this._renderPost() }
        <Text style={ styles.commentsTitle }>
          Comments
        </Text>
        <View style={ styles.commentsCard }>
          <CommentList
            comments={ this.state.comments }
            onReply={ this.onReply }
            mainNavigator={ this.props.mainNavigator }
            user={ this.props.user }
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
            height: constants.getStatusBarHeight(),
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
        <View
          style={{
            position: 'absolute',
            width: constants.width,
            bottom: this.state.keyboardSpace
          }}
        >
          { this._renderReplyInfo() }
          <View style={ styles.replyBar }>
            <TextInput
              ref={ ref => { this.ReplyInput = ref; }}
              style={ styles.replyInput }
              placeholder='Reply'
              placeholderTextColor='#AAA'
              returnKeyType='send'
              clearButtonMode='while-editing'
              value={ this.state.replyText }
              onChangeText={ text => this.setState({ replyText: text }) }
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
    flex: 1,
    marginBottom: 48
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
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#2CB673',
    paddingLeft: 10,
    paddingRight: 10
  },
  replyingTo: {
    fontSize: 17,
    color: '#fff',
    marginRight: 5
  },
  replyAuthor: {
    fontSize: 17,
    color: '#fff',
    marginRight: 5,
    fontWeight: 'bold'
  },
  replyBody: {
    fontSize: 15,
    color: '#fff',
    fontStyle: 'italic'
  },
  replyBar: {
    backgroundColor: '#fff',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    borderTopWidth: 1,
    borderTopColor: '#DDD'
  },
  replyInput: {
    flex: 1,
    color: '#333',
    height: 48,
    fontSize: 17,
    paddingHorizontal: 10
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
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  notFoundText: {
    color: '#555',
    fontWeight: 'bold'
  }
});

module.exports = CommentView;

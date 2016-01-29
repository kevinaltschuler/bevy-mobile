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
var PostActions = require('./../../../post/PostActions');
var CommentActions = require('./../../../post/CommentActions');
var POST = constants.POST;

var CommentView = React.createClass({
  propTypes: {
    post: React.PropTypes.object,
    user: React.PropTypes.object,
    loggedIn: React.PropTypes.bool,
    mainNavigator: React.PropTypes.object
  },

  getInitialState() {
    var post = this.props.post;
    PostActions.clearTempPost();
    PostActions.setTempPost(post);
    return {
      post: post,
      replyToComment: {},
      replyText: '',
      keyboardSpace: 0,
      loading: false
    };
  },

  componentDidMount() {
    DeviceEventEmitter.addListener('keyboardWillShow', this.onKeyboardShow);
    DeviceEventEmitter.addListener('keyboardWillHide', this.onKeyboardHide);

    PostStore.on(POST.FETCHING_SINGLE, this.onFetchingSingle);
    PostStore.on(POST.FETCHED_SINGLE, this.onFetchedSingle);
    PostStore.on(POST.CHANGE_ONE + this.props.post._id, this.onPostChange);

    this.onRefresh();
  },
  componentWillUnmount() {
    PostStore.off(POST.FETCHING_SINGLE, this.onFetchingSingle);
    PostStore.off(POST.FETCHED_SINGLE, this.onFetchedSingle);
    PostStore.off(POST.CHANGE_ONE + this.props.post._id, this.onPostChange);

    PostActions.clearTempPost();
  },

  componentWillReceiveProps(nextProps) {
    var post = nextProps.post;
    this.setState({
      post: post
    });
  },

  onKeyboardShow(ev) {
    var height = (ev.end) ? ev.end.height : ev.endCoordinates.height;
    this.setState({ keyboardSpace: height });
  },
  onKeyboardHide(ev) {
    this.setState({ keyboardSpace: 0 });
  },

  onFetchingSingle() {
    this.setState({ loading: true });
  },
  onFetchedSingle(post) {
    this.setState({
      loading: false,
      post: post
    });
  },

  onPostChange() {
    var post = PostStore.getPost(this.props.post._id);
    console.log('post change', post);
    this.setState({
      post: post
    });
  },

  onRefresh() {
    PostActions.fetchSingle(this.state.post._id);
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
    //this.scrollToBottom();
  },

  onReplyFocus() {
    // if we're not replying to a comment, then scroll
    // to the bottom of the comment list
    if(_.isEmpty(this.state.replyToComment)) {
      //this.scrollToBottom();
    }
  },

  scrollToBottom() {
    // dont even try if the scroll view hasn't mounted yet
    if(this.ScrollView == undefined) return;

    var innerScrollView = this.ScrollView.refs.InnerScrollView;
    var scrollView = this.ScrollView.refs.ScrollView;

    requestAnimationFrame(() => {
      innerScrollView.measure((innerScrollViewX, innerScrollViewY,
        innerScrollViewWidth, innerScrollViewHeight) => {

        scrollView.measure((scrollViewX, scrollViewY, scrollViewWidth, scrollViewHeight) => {
          var scrollTo = innerScrollViewHeight - scrollViewHeight + innerScrollViewY;

          if(innerScrollViewHeight < scrollViewHeight) {
            return;
          }

          this.ScrollView.scrollTo(scrollTo, 0);
        });
      });
    });
  },

  postReply() {
    var text = this.state.replyText;
    // dont post empty reply
    if(_.isEmpty(text)) {
      return;
    };
    this.setState({ replyText: '' });
    // clear the reply text input text
    this.ReplyInput.clear();
    // blur the input and close the keyboard
    this.ReplyInput.blur();

    // call action
    CommentActions.create(
      text, // body
      this.props.user, // author object
      this.props.post._id, // post id
      // parent id
      (_.isEmpty(this.state.replyToComment))
        ? null
        : this.state.replyToComment._id,
    );
  },

  _renderPost() {
    if(this.state.post.type == 'event') {
      return (
        <View style={{ marginTop: 0 }}>
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
      <View style={{ marginTop: 5 }}>
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
    var text = (
      <Text style={ styles.noCommentsText }>
        No Comments Yet!
      </Text>
    );

    if(_.isEmpty(this.state.post.nestedComments))
      return text;
    if(this.state.post.commentCount <= 0)
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
              comments={ this.state.post.nestedComments }
              onReply={ this.onReply }
              mainNavigator={ this.props.mainNavigator }
              user={ this.props.user }
            />
            { this._renderNoCommentsText() }
          </View>
        </ScrollView>
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
              placeholder='Write a Comment...'
              placeholderTextColor='#AAA'
              returnKeyType='send'
              clearButtonMode='while-editing'
              value={ this.state.replyText }
              onChangeText={ text => this.setState({ replyText: text }) }
              onSubmitEditing={ this.postReply }
              onBlur={ this.onReplyBlur }
              onFocus={ this.onReplyFocus }
            />
            <TouchableOpacity
              activeOpacity={ 0.5 }
              onPress={ this.postReply }
              style={ styles.replyButton }
            >
              <Text style={[ styles.replyButtonText, {
                color: (_.isEmpty(this.state.replyText)) ? '#CCC' : '#2CB673'
              }]}>
                Post
              </Text>
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
    borderTopColor: '#AAA'
  },
  replyInput: {
    flex: 1,
    color: '#333',
    height: 36,
    fontSize: 17,
    marginTop: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#CCC'
  },
  replyButton: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 12
  },
  replyButtonText: {
    fontSize: 17
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

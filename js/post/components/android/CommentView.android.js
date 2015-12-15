/**
 * CommentView.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableNativeFeedback,
  ToastAndroid,
  BackAndroid,
  PullToRefreshViewAndroid,
  StyleSheet
} = React;
var Icon = require('./../../../shared/components/android/Icon.android.js');
var Post = require('./Post.android.js');
var CommentList = require('./CommentList.android.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var UserStore = require('./../../../user/UserStore');
var CommentActions = require('./../../CommentActions');
var PostStore = require('./../../../post/PostStore');
var POST = constants.POST;

var CommentView = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    mainRoute: React.PropTypes.object,
    post: React.PropTypes.object,
    activeBevy: React.PropTypes.object,
    user: React.PropTypes.object,
    loggedIn: React.PropTypes.bool
  },

  getInitialState() {
    return {
      input: '',
      replyToComment: {},
      comments: this.nestComments(this.props.post.comments),
      selectedComment: '',
      post: this.props.post,
      refreshing: false
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      post: nextProps.post,
      comments: this.nestComments(nextProps.post.comments)
    });
  },

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.onBackButton);
    PostStore.on(POST.CHANGE_ONE + this.props.post._id, this.onPostChange);
  },
  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.onBackButton);
    PostStore.off(POST.CHANGE_ONE + this.props.post._id, this.onPostChange);
  },

  onPostChange() {
    //this.setState({
    //  comments: this.nestComments(PostStore.getPost(this.props.post._id).comments)
    //});
  },

  onBackButton() {
    this.props.mainNavigator.pop();
    return true;
  },

  onInputFocus() {
    setTimeout(() => {
      if(this.scrollView == undefined || !this.scrollView.scrollResponderScrollTo)
        return;
      this.scrollView.scrollResponderScrollTo(0, 9999999999);
    }, 250);
  },

  onReply(comment) {
    this.setState({
      replyToComment: comment
    });
    // focus the input
    this.refs.Input.focus();
  },

  onRefresh() {
    var url = constants.apiurl + '/bevies/' + this.props.post.bevy._id
      + '/posts/' + this.props.post._id;

    this.setState({
      refreshing: true
    });

    fetch(url)
    .then(res => res.json())
    .then(res => {
      this.setState({
        post: res,
        comments: this.nestComments(res.comments),
        refreshing: false
      });
    });
  },

  onCommentSelect(comment_id) {
    this.setState({
      selectedComment: (this.state.selectedComment == comment_id)
        ? ''
        : comment_id
    });
  },

  nestComments(comments, parentId, depth) {
    // increment depth (used for indenting later)
    if(typeof depth === 'number') depth++;
    else depth = 0;
    if(_.isEmpty(comments)) return [];
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

  postReply() {
    // gate this if not logged in
    if(!this.props.loggedIn) {
      ToastAndroid.show('Please Log In to Comment', ToastAndroid.SHORT);
      return;
    }

    var text = this.state.input;
    // dont post empty reply
    if(_.isEmpty(text)) {
      this.setState({
        input: ''
      });
      return;
    };
    var user = this.props.user;

    // call action
    CommentActions.create(
      text, // body
      user._id, // author id
      this.props.post._id, // post id
      (_.isEmpty(this.state.replyToComment))
        ? null
        : this.state.replyToComment._id // parent id
    );

    // optimistic update
    var comment = {
      _id: Date.now(), // temp id
      author: user,
      body: text,
      postId: this.state.post,
      parentId: (_.isEmpty(this.state.replyToComment))
        ? null
        : this.state.replyToComment._id,
      created: (new Date()).toString(),
      comments: []
    };
    var comments = this.state.post.comments;
    comments.push(comment);
    comments = this.nestComments(comments);
    this.setState({
      input: '', // clear comment field
      comments: comments
    });

    // blur reply input
    // buffer delay it so it blurs only when the set state clears up
    setTimeout(
      () => this.refs.Input.blur(), // this also clears the replyToComment state field
      100
    );
  },

  _renderCommentList() {
    return (
      <View style={{ flex: 1 }}>
        <Text style={ styles.commentHeader }>Comments</Text>
        <CommentList
          comments={ this.state.comments }
          onReply={ this.onReply }
          user={ UserStore.getUser() }
          mainNavigator={ this.props.mainNavigator }
          mainRoute={ this.props.mainRoute }
          post={ this.state.post }
          root={ true }
          onSelect={ this.onCommentSelect }
          selectedComment={ this.state.selectedComment }
        />
      </View>
    );
  },

  _renderReplyBar() {
    if(_.isEmpty(this.state.replyToComment)) return <View />;
    else return (
      <View style={ styles.replyBar }>
        <Text style={ styles.replyingTo }>Replying to:</Text>
        <Text style={ styles.replyAuthor }>
          { this.state.replyToComment.author.displayName }
        </Text>
        <Text style={ styles.replyBody }>
          { this.state.replyToComment.body }
        </Text>
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#CCC') }
          onPress={() => {
            this.refs.Input.blur();
            this.setState({ replyToComment: {} });
          }}
        >
          <View style={ styles.cancelButton }>
            <Text style={ styles.cancelButtonText }>
              Cancel
            </Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  },

  _renderInput() {
    return (
      <View style={ styles.input }>
        <TextInput
          ref='Input'
          value={ this.state.input }
          style={ styles.textInput }
          onChangeText={(text) => this.setState({ input: text })}
          onFocus={ this.onInputFocus }
          onBlur={() => this.setState({ replyToComment: {} })}
          placeholder='Comment'
          placeholderTextColor='#AAA'
          underlineColorAndroid='#FFF'
        />
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#CCC', false) }
          onPress={ this.postReply }
        >
          <View style={ styles.sendButton }>
            <Icon
              name='send'
              size={ 30 }
              color='#2CB673'
            />
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  },

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.topBar }>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#62D487', false) }
            onPress={() => {
              this.props.mainNavigator.pop();
            }}
          >
            <View style={ styles.backButton }>
              <Icon
                name='arrow-back'
                size={ 30 }
                color='#FFF'
              />
            </View>
          </TouchableNativeFeedback>
          <Text style={ styles.title }>
            { this.props.activeBevy.name }
          </Text>
        </View>
        <PullToRefreshViewAndroid
          style={{
            flex: 1
          }}
          refreshing={ this.state.refreshing }
          onRefresh={ this.onRefresh }
        >
          <ScrollView
            ref={ ref => { this.scrollView = ref; }}
            style={ styles.listContainer }
            showsVerticalScrollIndicator={ true }
          >
            <Post
              post={ this.state.post }
              mainNavigator={ this.props.mainNavigator }
              mainRoute={ this.props.mainRoute }
              expandText={ true }
              card={ false }
              user={ this.props.user }
              loggedIn={ this.props.loggedIn }
              activeBevy={ this.props.activeBevy }
            />
            { this._renderCommentList() }
            <View style={{ height: 20 }} />
          </ScrollView>
        </PullToRefreshViewAndroid>
        { this._renderReplyBar() }
        { this._renderInput() }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE'
  },
  listContainer: {
    flex: 1,
    paddingTop: 10
  },
  commentHeader: {
    marginBottom: 4,
    marginLeft: 10,
    color: '#AAA'
  },
  topBar: {
    width: constants.width,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2CB673'
  },
  backButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 10
  },
  title: {
    flex: 1,
    color: '#FFF',
    fontSize: 18
  },
  input: {
    backgroundColor: '#FFF',
    height: 48,
    width: constants.width,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingLeft: 10
  },
  textInput: {
    flex: 1,
    marginRight: 8
  },
  sendButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 8
  },
  replyBar: {
    backgroundColor: '#2CB673',
    height: 36,
    width: constants.width,
    flexDirection: 'row',
    alignItems: 'center'
  },
  replyingTo: {
    color: '#FFF',
    marginLeft: 8,
    marginRight: 4
  },
  replyAuthor: {
    color: '#FFF',
    fontWeight: 'bold',
    marginRight: 4
  },
  replyBody: {
    flex: 1,
    color: '#FFF',
    fontStyle: 'italic'
  },
  cancelButton: {
    backgroundColor: '#62D487',
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
    paddingHorizontal: 6
  },
  cancelButtonText: {
    color: '#FFF'
  }
});

module.exports = CommentView;

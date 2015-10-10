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
var Icon = require('react-native-vector-icons/Ionicons');

var Post = require('./Post.ios.js');
var Navbar = require('./../../shared/components/Navbar.ios.js');

var CommentList = require('./CommentList.ios.js');

var _ = require('underscore');
var constants = require('./../../constants');
var PostStore = require('./../PostStore');
var CommentActions = require('./../CommentActions');

var CommentView = React.createClass({

  propTypes: {
    postID: React.PropTypes.string,
    user: React.PropTypes.object,
    loggedIn: React.PropTypes.bool,
    authModalActions: React.PropTypes.object,
    mainNavigator: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      postID: '-1'
    };
  },

  getInitialState() {
    var post = PostStore.getPost(this.props.postID);
    var comments = this.nestComments(post.comments);
    return {
      post: post,
      comments: comments,
      replyToComment: {},
      replyText: '',
      keyboardSpace: 0
    };
  },

  _onKeyboardShowed(ev) {
    var height = (ev.end) ? ev.end.height : ev.endCoordinates.height;
    this.setState({
      keyboardSpace: height
    });
  },

  _onKeyboardHid(ev) {
    this.setState({
      keyboardSpace: 0
    });
  },

  componentDidMount() {
    DeviceEventEmitter.addListener('keyboardDidShow', this._onKeyboardShowed);
    DeviceEventEmitter.addListener('keyboardWillHide', this._onKeyboardHid);
  },
  
  componentWillUnmount() {
    //DeviceEventEmitter.removeListener('keyboardDidShow', this._onKeyboardShowed);
    //DeviceEventEmitter.removeListener('keyboardDidHide', this._onKeyboardHid);
  },

  onReply(comment) {
    // rerender with this comment reply active
    this.setState({
      replyToComment: comment
    });
    // focus the text field
    this.refs.reply.focus();
  },

  postReply() {
    // gate this if not logged in
    if(!this.props.loggedIn) {
      this.props.authModalActions.open('Log In To Comment');
      return;
    }

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
    return (
      <View style={{marginTop: 0}}>
        <Post
          inCommentView={ true }
          post={ this.state.post }
        />
      </View>
    );
  },

  _renderNoCommentsText() {
    if(_.isEmpty(this.state.comments)) return;
    if(this.state.comments.length <= 0) {
      return (
        <Text style={ styles.noCommentsText }>
          No Comments Yet!
        </Text>
      );
    } else {
      return null;
    }
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
        style={{ position: 'absolute', 
                  width: constants.width, 
                  bottom: this.state.keyboardSpace
              }}
      >
        { replyInfo }
        <View style={ styles.replyBar }>
          <TextInput
            ref='reply'
            placeholder='Reply'
            returnKeyType='send'
            clearButtonMode='while-editing'
            value={ this.state.replyText }
            onChangeText={(text) => {
              this.setState({
                replyText: text
              });
            }}
            onSubmitEditing={(ev) => {
              // post comment
              this.postReply();
            }}
            onBlur={() => {
              // cancel the comment reply if unfocused
              if(!_.isEmpty(this.state.replyToComment)) {
                this.setState({
                  replyToComment: {},
                  replyText: this.state.replyText // set again because of set state lag
                });
              }
            }}
            style={ styles.replyInput }
          />
          <TouchableOpacity
            onPress={() => {
              this.postReply();
            }}
            style={ styles.replyButton }
          >
            <Text style={ styles.replyButtonText }>
              Post
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  },

  render() {
    var content = (_.isEmpty(this.state.post))
    ? (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{color: '#555', fontWeight: '600'}}>
          post was not found
        </Text>
      </View>
      )
    : (
      <View>
        <ScrollView style={ styles.scrollView}>
          { this._renderPost() }
          <View style={ styles.commentsCard }>
            <CommentList
              comments={ this.state.comments }
              onReply={ this.onReply }
              mainNavigator={ this.props.mainNavigator }
            />
            { this._renderNoCommentsText() }
          </View>
        </ScrollView>
      </View>
    );
    return (
      <View style={ styles.container }>
        <Navbar 
          styleParent={{
            backgroundColor: '#2CB673',
            flexDirection: 'column',
            paddingTop: 0
          }}
          styleBottom={{
            backgroundColor: '#2CB673',
            height: 48,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          left={
            <TouchableHighlight
              underlayColor={'rgba(0,0,0,0)'}
              onPress={() => {
                
                // blur all text inputs
                
                // go back
                this.props.mainNavigator.pop();
              }}
              style={ styles.navButtonLeft }>
              <Text style={ styles.navButtonTextLeft }>
                Cancel
              </Text>
            </TouchableHighlight>
          }
          center={
            <View style={ styles.navTitle }>
              <Text style={ styles.navTitleText }>
                Comments For...
              </Text>
            </View>
          }
          right={
            <View style={ styles.navButtonRight } />
          }
        />
        {content}
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

  navButtonLeft: {
    flex: 1,
    marginLeft: 8
  },
  navButtonRight: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  navButtonTextLeft: {
    color: '#fff',
    fontSize: 17
  },
  navButtonTextRight: {
    color: '#ddd',
    fontSize: 17,
    textAlign: 'right'
  },
  navTitle: {
    flex: 2
  },
  navTitleText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center'
  },

  scrollView: {
    flex: 1,
    flexDirection: 'column'
  },
  commentsCard: {
    flexDirection: 'column',
    margin: 10,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: 'white',
    borderRadius: 2,
    shadowColor: '#000',
    shadowRadius: 1,
    shadowOpacity: .3,
    shadowOffset:  {width: 0, height: 0},
  },

  noCommentsText: {
    textAlign: 'center'
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
    flex: 3,
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
    flex: 1,
    paddingTop: 0,
    paddingBottom: 0
  },
  replyButtonText: {
    paddingLeft: 20,
    paddingRight: 5,
    paddingTop: 10,
    fontSize: 17,
    color: '#2CB673',
    fontWeight: 'bold',
    marginBottom: -10
  }
});

module.exports = CommentView;
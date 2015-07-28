'use strict';

var React = require('react-native');
var {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity
} = React;
var {
  Icon
} = require('react-native-icons');

var Post = require('./Post.ios.js');
var Navbar = require('./../../shared/components/Navbar.ios.js');
var Accordion = require('react-native-accordion');

var _ = require('underscore');
var KeyboardEvents = require('react-native-keyboardevents');
var KeyboardEventEmitter = KeyboardEvents.Emitter;
var constants = require('./../../constants');
var timeAgo = require('./../../shared/helpers/timeAgo');
var PostStore = require('./../PostStore');
var CommentActions = require('./../CommentActions');

var CommentItem = React.createClass({
  propTypes: {
    comment: React.PropTypes.object,
    onReply: React.PropTypes.func
  },

  getInitialState() {
    return {
      selected: false
    };
  },

  _renderCommentList() {
    if(_.isEmpty(this.props.comment.comments)) return null;
    return (
      <CommentList
        comments={ this.props.comment.comments }
        onReply={ this.props.onReply }
      />
    );
  },

  render() {
    return (
      <View>
        <Accordion
          ref='accordion'
          underlayColor='rgba(0,0,0,0.1)'
          animationDuration={ 200 }
          onPress={() => {
            this.setState({
              selected: !this.state.selected
            });
          }}
          header={
            <View style={[ styles.commentItem, { 
              paddingLeft: this.props.comment.depth * 10,
              backgroundColor: (this.state.selected) ? '#eee' : '#fff'
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
                  { this.props.comment.body.trim() }
                </Text>
              </View>
            </View>
          }
          content={
            <View style={ styles.commentItemActions }>
              <TouchableHighlight
                underlayColor='rgba(0,0,0,0.1)'
                onPress={() => {
                  // bubble this comment up
                  this.props.onReply(this.props.comment);
                  // close the accordion
                  this.refs.accordion.close();
                  // unselect self
                  this.setState({
                    selected: false
                  });
                }}
                style={ styles.commentItemAction }
              >
                <Icon
                  name='ion|ios-undo'
                  size={ 20 }
                  color='#fff'
                  style={{ width: 20, height: 20 }}
                />
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor='rgba(0,0,0,0.1)'
                onPress={() => {

                }}
                style={ styles.commentItemAction }
              >
                <Icon
                  name='ion|ios-person'
                  size={ 20 }
                  color='#fff'
                  style={{ width: 20, height: 20 }}
                />
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor='rgba(0,0,0,0.1)'
                onPress={() => {

                }}
                style={ styles.commentItemAction }
              >
                <Icon
                  name='ion|ios-more'
                  size={ 20 }
                  color='#fff'
                  style={{ width: 20, height: 20 }}
                />
              </TouchableHighlight>
            </View>
          }
        />
        <View style={ styles.commentItemComments }>
          { this._renderCommentList() }
        </View>
      </View>
    );
  }
});

var CommentList = React.createClass({
  propTypes: {
    comments: React.PropTypes.array,
    onReply: React.PropTypes.func
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
            />
          );
        }.bind(this)) }
      </View>
    );
  }
});

var CommentView = React.createClass({

  propTypes: {
    postID: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      postID: '-1',
      keyboardSpace: 0
    };
  },

  getInitialState() {
    var post = PostStore.getPost(this.props.postID);
    var comments = this.nestComments(post.comments);
    return {
      post: post,
      comments: comments,
      replyToComment: {},
      replyText: ''
    };
  },

  componentDidMount() {
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardDidShowEvent, (frames) => {
      this.setState({
        keyboardSpace: frames.end.height
      });
    });
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillHideEvent, (frames) => {
      this.setState({
        keyboardSpace: 0
      });
    });
  },
  
  componentWillUnmount() {

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
    var text = this.state.replyText;
    // dont post empty reply
    if(_.isEmpty(text)) {
      this.setState({
        replyText: ''
      });
      return;
    };
    var user = constants.getUser();

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
      <Post
        inCommentView={ true }
        post={ this.state.post }
      />
    );
  },

  _renderReplyBar() {

    var replyInfo = (_.isEmpty(this.state.replyToComment))
    ? null
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
      <View style={[ styles.reply, {
        marginBottom: this.state.keyboardSpace
      }]}>
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
            alignItems: 'center'
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

        <ScrollView style={ styles.scrollView }>
          { this._renderPost() }
          <View style={ styles.commentsCard }>
            <CommentList
              comments={ this.state.comments }
              onReply={ this.onReply }
            />
          </View>
        </ScrollView>

        { this._renderReplyBar() }

      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#eee'
  },

  navButtonLeft: {
    flex: 1
  },
  navButtonRight: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  navButtonTextLeft: {
    color: '#ddd',
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
    shadowColor: 'black',
    shadowRadius: 1,
    shadowOpacity: .3,
    shadowOffset:  {width: 0, height: 0}
  },
  commentList: {
    flexDirection: 'column',
  },
  commentItem: {
    flexDirection: 'column',
    paddingTop: 5,
    paddingBottom: 5
  },
  commentItemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 10
  },
  commentItemAuthor: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 5
  },
  commentItemDetails: {
    fontSize: 12
  },
  commentItemBody: {
    paddingLeft: 10
  },
  commentItemBodyText: {
    fontSize: 14
  },
  commentItemComments: {

  },

  commentItemActions: {
    flexDirection: 'row',
    height: 36,
    backgroundColor: '#2CB673',
    alignItems: 'center',
  },
  commentItemAction: {
    height: 36,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
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
    paddingTop: 10,
    paddingBottom: 10
  },
  replyButtonText: {
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 17,
    color: '#2CB673',
    fontWeight: 'bold'
  }
});

module.exports = CommentView;
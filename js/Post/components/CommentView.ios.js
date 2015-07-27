'use strict';

var React = require('react-native');
var {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = React;
var {
  Icon
} = require('react-native-icons');

var Post = require('./Post.ios.js');
var Navbar = require('./../../shared/components/Navbar.ios.js');

var _ = require('underscore');
var constants = require('./../../constants');
var timeAgo = require('./../../shared/helpers/timeAgo');
var PostStore = require('./../PostStore');

var CommentItem = React.createClass({
  propTypes: {
    comment: React.PropTypes.object
  },

  _renderCommentList() {
    if(_.isEmpty(this.props.comment.comments)) return null;
    return (
      <CommentList
        comments={ this.props.comment.comments }
      />
    );
  },

  render() {
    return (
      <View>
        <TouchableHighlight
          style={{ paddingLeft: this.props.comment.depth * 10 }}
          underlayColor='rgba(0,0,0,0.1)'
          onPress={() => {

          }}
        >
          <View style={[ styles.commentItem ]}>
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
        </TouchableHighlight>
        <View style={ styles.commentItemComments }>
          { this._renderCommentList() }
        </View>
      </View>
    );
  }
});

var CommentList = React.createClass({
  propTypes: {
    comments: React.PropTypes.array
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
      postID: '-1'
    };
  },

  getInitialState() {
    var post = PostStore.getPost(this.props.postID);
    var comments = this.nestComments(post.comments);
    console.log(comments.length);
    return {
      post: post,
      comments: comments
    };
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
            />
          </View>
        </ScrollView>

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
    flexDirection: 'column',
    marginBottom: 15
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
    marginRight: 10
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

  }
});

module.exports = CommentView;
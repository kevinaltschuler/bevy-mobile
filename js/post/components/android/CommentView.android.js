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
  BackAndroid,
  TouchableNativeFeedback,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var Post = require('./Post.android.js');
var CommentList = require('./CommentList.android.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var UserStore = require('./../../../user/UserStore');

var CommentView = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    mainRoute: React.PropTypes.object,
    post: React.PropTypes.object,
    activeBevy: React.PropTypes.object
  },

  getInitialState() {
    return {
      input: '',
      replyToComment: {}
    };
  },

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.onBack);
  },
  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.onBack);
  },

  onBack() {
    this.refs.Input.blur();
    return true;
  },

  onReply(comment) {
    this.setState({
      replyToComment: comment
    });
    // focus the input
    this.refs.Input.focus();
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

  postComment() {

  },

  _renderCommentList() {
    return (
      <View style={{ flex: 1 }}>
        <CommentList
          comments={ this.nestComments(this.props.post.comments) }
          onReply={ this.onReply }
          user={ UserStore.getUser() }
          mainNavigator={ this.props.mainNavigator }
          mainRoute={ this.props.mainRoute }
        />
      </View>
    );
  },

  _renderReplyBar() {
    if(_.isEmpty(this.state.replyToComment)) return <View />;
    else return (
      <View style={ styles.replyBar }>
        <Text style={ styles.replyingTo }>Replying To</Text>
        <Text style={ styles.replyAuthor }>
          { this.state.replyToComment.author.displayName }
        </Text>
        <Text style={ styles.replyBody }>
          { this.state.replyToComment.body }
        </Text>
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
          onBlur={() => this.setState({ replyToComment: {} })}
          placeholder='Comment'
          placeholderTextColor='#AAA'
          underlineColorAndroid='#AAA'
        />
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#CCC', false) }
          onPress={ this.postComment }
        >
          <View style={ styles.sendButton }>
            <Text style={ styles.sendButtonText }>Send</Text>
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
            onPress={() => {
              this.props.mainNavigator.pop();
            }}
          >
            <View style={ styles.backButton }>
              <Icon
                name='arrow-back'
                size={ 30 }
                color='#888'
              />
            </View>
          </TouchableNativeFeedback>
          <Text style={ styles.title }>
            { this.props.activeBevy.name }
          </Text>
          <View style={ styles.backButton }>
            <Icon
              name='arrow-back'
              size={ 30 }
              color='#FFF'
            />
          </View>
        </View>
        <ScrollView 
          style={ styles.listContainer }
          showsVerticalScrollIndicator={ true }
        >
          <Post
            post={ this.props.post }
            mainNavigator={ this.props.mainNavigator }
            mainRoute={ this.props.mainRoute }
            expandText={ true }
          />
          { this._renderCommentList() }
        </ScrollView>
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
    paddingBottom: 48
  },
  topBar: {
    width: constants.width,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF'
  },
  backButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 8,
    paddingRight: 8,
    marginRight: 8
  },
  title: {
    textAlign: 'center',
    color: '#666'
  },
  input: {
    backgroundColor: '#FFF',
    height: 48,
    width: constants.width,
    flexDirection: 'row',
    alignItems: 'center'
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
  sendButtonText: {
    color: '#2CB673'
  },
  replyBar: {
    backgroundColor: '#2CB673',
    height: 36,
    width: constants.width,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 8
  },
  replyingTo: {
    color: '#FFF',
    marginRight: 4
  },
  replyAuthor: {
    color: '#FFF',
    marginRight: 4
  },
  replyBody: {
    color: '#FFF'
  }
});

module.exports = CommentView;
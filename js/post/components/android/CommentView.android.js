/**
 * CommentView.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TextInput,
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
      input: ''
    };
  },

  onReply() {

  },

  postComment() {

  },

  _renderCommentList() {
    return (
      <CommentList
        comments={ this.props.post.comments }
        onReply={ this.onReply }
        user={ UserStore.getUser() }
        mainNavigator={ this.props.mainNavigator }
        mainRoute={ this.props.mainRoute }
      />
    );
  },

  _renderReplyBar() {
    return <View />;
  },

  _renderInput() {
    return (
      <View style={ styles.input }>
        <TextInput
          ref='Input'
          value={ this.state.input }
          style={ styles.textInput }
          onChangeText={(text) => this.setState({ input: text })}
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
        <Post
          post={ this.props.post }
          mainNavigator={ this.props.mainNavigator }
          mainRoute={ this.props.mainRoute }
        />
        { this._renderCommentList() }
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
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 8,
    marginBottom: 24
  },
  textInput: {
    flex: 1
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
  }
});

module.exports = CommentView;
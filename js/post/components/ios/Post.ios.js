/**
 * Post.ios.js
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View
} = React;
var PostHeader = require('./PostHeader.ios.js');
var PostFooter = require('./PostFooter.ios.js');
var PostImage = require('./PostImage.ios.js');
var PostBody = require('./PostBody.ios.js');
var PostLinks = require('./PostLinks.ios.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var POST = constants.POST;
var routes = require('./../../../routes');
var PostActions = require('./../../../post/PostActions');
var PostStore = require('./../../../post/PostStore');

var Post = React.createClass({
  propTypes: {
    mainRoute: React.PropTypes.object,
    mainNavigator: React.PropTypes.object,
    inCommentView: React.PropTypes.bool,
    post: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      inCommentView: false,
      post: {}
    };
  },

  getInitialState() {
    return {
      post: this.props.post
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      post: nextProps.post
    });
  },

  componentDidMount() {
    PostStore.on(POST.CHANGE_ONE + this.props.post._id, this.onPostUpdate);
  },
  componentWillUnmount() {
    PostStore.off(POST.CHANGE_ONE + this.props.post._id, this.onPostUpdate);
  },

  onPostUpdate() {
    this.setState({
      post: PostStore.getPost(this.props.post._id)
    });
  },

  render() {
    return (
      <View style={ styles.container }>
        <PostHeader
          post={ this.state.post }
          user={ this.props.user }
          mainNavigator={ this.props.mainNavigator }
          mainRoute={ this.props.mainRoute }
        />
        <PostBody
          post={ this.state.post }
          expandText={ this.props.inCommentView }
          mainNavigator={ this.props.mainNavigator }
          mainRoute={ this.props.mainRoute }
        />
        <PostLinks
          post={ this.state.post }
          mainNavigator={ this.props.mainNavigator }
        />
        <PostImage
          post={ this.state.post }
        />
        <PostFooter
          post={ this.state.post }
          user={ this.props.user }
          inCommentView={ this.props.inCommentView }
          mainNavigator={ this.props.mainNavigator }
          mainRoute={ this.props.mainRoute }
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: constants.width - 20,
    marginTop: 5,
    marginBottom: 5,
    marginHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 2
  }
});

module.exports = Post;

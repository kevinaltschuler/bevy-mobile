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
  View,
  Image,
  TouchableHighlight,
  Animated,
  TextInput
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var ImageOverlay = require('./ImageOverlay.ios.js');
var PostHeader = require('./PostHeader.ios.js');
var PostFooter = require('./PostFooter.ios.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var POST = constants.POST;
var routes = require('./../../../routes');
var timeAgo = require('./../../../shared/helpers/timeAgo');
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
      post: {},
      isEditing: false
    };
  },

  getInitialState() {
    return {
      post: this.props.post,
      overlayVisible: false,
      editTitle: this.props.post.title
    };
  },

  componentDidMount() {
    PostStore.on(POST.CHANGE_ONE + this.props.post._id, () => {
      this.setState({
        post: PostStore.getPost(this.props.post._id)
      });
    });
  },

  componentWillUnmount() {
    PostStore.off(POST.CHANGE_ONE + this.props.post._id);
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      post: nextProps.post
    });
  },

  onEdit() {
    this.setState({
      isEditing: true
    });
  },

  _renderPostTitle() {
    if(_.isEmpty(this.state.post.title)) return null;
    if(this.state.isEditing) {
      return (
        <View style={styles.body}>
          <TextInput
            value={ this.state.editTitle }
            onChangeText={(text) => {
              this.setState({ editTitle: text})
            }}
            defaultValue={ this.state.editTitle}
            autoFocus={true}
            multiline={true}
            clearButtonMode={'always'}
            style={{
              height: 100,
              flex: 1,
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,.1)',
              borderRadius: 4,
              marginBottom: 10,
              padding: 10
            }}
          >
          </TextInput>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>

            <TouchableHighlight
              underlayColor='rgba(0,0,0,.1)'
              onPress={() => {
                this.setState({
                  editTitle: this.props.post.title,
                  isEditing: false
                });
              }}
              style={{marginRight: 10}}
            >
              <Text style={styles.cancelButton}>
                cancel
              </Text>
            </TouchableHighlight>

            <TouchableHighlight
              underlayColor='rgba(0,0,0,.1)'
              onPress={() => {
                PostActions.update(this.props.post._id, this.state.editTitle);
                this.setState({
                  isEditing: false
                });
              }}
            >
              <Text style={styles.acceptButton}>
                accept
              </Text>
            </TouchableHighlight>

          </View>
        </View>
      );
    }
    return (
      <View style={styles.body}>
        <Text style={styles.bodyText}>
          { this.state.editTitle }
        </Text>
      </View>
    );
  },

  _renderImageOverlay() {
    if(this.state.post.images.length <= 0) return null;
    return (
      <ImageOverlay
        images={ this.state.post.images }
        isVisible={ this.state.overlayVisible }
        post={ this.state.post }
      />
    );
  },

  _renderPostImage() {
    if(_.isEmpty(this.state.post.images)) {
      return <View />;
    }
    var imageCount = this.state.post.images.length;
    var imageCountText = (imageCount > 1)
    ? (
      <Text style={ styles.postImageCountText }>
        + { imageCount - 1 } more
      </Text>
    )
    : null;

    return (
      <TouchableHighlight
        underlayColor='rgba(0,0,0,0.1)'
        onPress={() => {
          this.setState({
            overlayVisible: true
          });
        }}
      >
        <Image
          style={ styles.postImage }
          source={{ uri: this.state.post.images[0].path }}
          resizeMode='cover'
        >
          { imageCountText }
        </Image>
      </TouchableHighlight>
    );
  },

  render() {
    var post = this.state.post;

    return (
      <View style={styles.postCard}>
        <PostHeader
          post={ this.state.post }
          user={ this.props.user }
          mainNavigator={ this.props.mainNavigator }
          mainRoute={ this.props.mainRoute }
        />
        { this._renderPostTitle() }
        { this._renderImageOverlay() }
        { this._renderPostImage() }
        <PostFooter
          post={ this.state.post }
          user={ this.props.user }
          inCommentView={ this.props.inCommentView }
          mainNavigator={ this.props.mainNavigator }
          mainRoute={ this.props.mainRoute }
        />
      </View>
    );
  },
});

var sideMargins = 10;
var cardWidth = constants.width - sideMargins * 2;

var styles = StyleSheet.create({
  postCard: {
    flexDirection: 'column',
    width: cardWidth,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: sideMargins,
    marginRight: sideMargins,
    backgroundColor: 'white',
    borderRadius: 2,
  },
  body: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 15,
    paddingLeft: 15,
    paddingRight: 15
  },
  bodyText: {
    fontSize: 17,
    color: '#666'
  },
  postImage: {
    height: 75,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end'
  },
  postImageCountText: {
    marginTop: 5,
    marginRight: 10,
    backgroundColor: 'rgba(0,0,0,0)',
    color: '#eee',
    fontSize: 17
  },
  cancelButton: {
    padding: 5,
    borderRadius: 4,
    backgroundColor: '#fff',
    color: 'rgba(0,0,0,.3)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.3)',
    fontWeight: 'bold'
  },
  acceptButton: {
    padding: 5,
    borderRadius: 4,
    backgroundColor: '#fff',
    color: '#2cb673',
    borderColor: '#2cb673',
    borderWidth: 1,
    fontWeight: 'bold'
  }
});

module.exports = Post;

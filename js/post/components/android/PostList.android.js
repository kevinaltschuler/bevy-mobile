/**
 * PostList.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  ListView,
  Text,
  Image,
  StyleSheet
} = React;
var NewPostCard = require('./NewPostCard.android.js');
var Post = require('./Post.android.js');

var _ = require('underscore');
var constants = require('./../../../constants');

var PostList = React.createClass({
  propTypes: {
    allPosts: React.PropTypes.array,
    mainNavigator: React.PropTypes.object,
    mainRoute: React.PropTypes.object,
    user: React.PropTypes.object,
    loggedIn: React.PropTypes.bool,
    showNewPostCard: React.PropTypes.bool,
    activeBevy: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      allPosts: [],
      showNewPostCard: false,
      activeBevy: {}
    }
  },

  getInitialState() {
    var posts = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    return {
      posts: posts.cloneWithRows(this.props.allPosts)
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      posts: this.state.posts.cloneWithRows(nextProps.allPosts)
    });
  },

  _renderHeader() {
    return (
      <View style={ styles.header }>
        { this._renderBevyHeader() }
        { this._renderNewPostCard() }
      </View>
    );
  },

  _renderBevyHeaderImage() {
    if(this.props.activeBevy._id == -1 || _.isEmpty(this.props.activeBevy.image_url)) {
      return <View style={ styles.bevyImageWrapperDefault } />;
    } else {
      return (
        <View style={ styles.bevyImageWrapper }>
          <Image
            source={{ uri: this.props.activeBevy.image_url }}
            style={ styles.bevyImage }
          />
          <View style={ styles.imageDarkener } />
        </View>
      );
    }
  },

  _renderBevyHeader() {
    if(_.isEmpty(this.props.activeBevy)) return <View />;
    else return (
      <View style={ styles.bevyHeader }>
        { this._renderBevyHeaderImage() }
        <Text style={ styles.bevyName }>
          { this.props.activeBevy.name }
        </Text>
      </View>
    );
  },

  _renderNewPostCard() {
    if(!this.props.showNewPostCard) return <View />;
    else return (
      <NewPostCard
        user={ this.props.user }
        loggedIn={ this.props.loggedIn }
        mainNavigator={ this.props.mainNavigator }
      />
    );
  },

  render() {
    return (
      <View style={ styles.container }>
        <ListView
          dataSource={ this.state.posts }
          style={ styles.postList }
          renderHeader={ this._renderHeader }
          renderRow={(post) => 
            <Post
              key={ 'post:' + post._id }
              post={ post }
              mainNavigator={ this.props.mainNavigator }
              mainRoute={ this.props.mainRoute }
            />
          }
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  postList: {

  },
  header: {
    flexDirection: 'column',
    width: constants.width,
    marginBottom: 10
  },
  bevyHeader: {
    height: 48,
    width: constants.width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 1,
    marginBottom: 8
  },
  bevyImageWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: constants.width,
    height: 48
  },
  bevyImageWrapperDefault: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: constants.width,
    height: 48,
    backgroundColor: '#2CB673'
  },
  bevyImage: {
    width: constants.width,
    height: 48
  },
  imageDarkener: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: constants.width,
    height: 48,
    backgroundColor: '#000',
    opacity: 0.5
  },
  bevyName: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FFF'
  }
});

module.exports = PostList;
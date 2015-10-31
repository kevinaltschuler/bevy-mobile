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
  StyleSheet,
  TouchableNativeFeedback,
  ToastAndroid,
  ProgressBarAndroid
} = React;
var BevyBar = require('./../../../bevy/components/android/BevyBar.android.js');
var NewPostCard = require('./NewPostCard.android.js');
var Post = require('./Post.android.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var POST = constants.POST;
var PostStore = require('./../../PostStore');
var BevyActions = require('./../../../bevy/BevyActions');

var PostList = React.createClass({
  propTypes: {
    allPosts: React.PropTypes.array,
    mainNavigator: React.PropTypes.object,
    mainRoute: React.PropTypes.object,
    bevyNavigator: React.PropTypes.object,
    bevyRoute: React.PropTypes.object,
    user: React.PropTypes.object,
    loggedIn: React.PropTypes.bool,
    showNewPostCard: React.PropTypes.bool,
    renderHeader: React.PropTypes.bool,
    activeBevy: React.PropTypes.object,
    activeTags: React.PropTypes.array
  },

  getDefaultProps() {
    return {
      allPosts: [],
      showNewPostCard: false,
      renderHeader: true,
      activeBevy: {},
      activeTags: ['-1'] // default is -1, which means show all posts
    }
  },

  getInitialState() {
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    var posts = this.props.allPosts;
    posts = this.prunePosts(posts);
    return {
      posts: ds.cloneWithRows(posts),
      loading: _.isEmpty(posts) // if there are no posts to display, 
                                // then they're probably loading at first
    };
  },

  componentDidMount() {
    PostStore.on(POST.LOADING, this._onPostsLoading);
    PostStore.on(POST.LOADED, this._onPostsLoaded);
  },
  componentWillUnmount() {
    PostStore.off(POST.LOADING, this._onPostsLoading);
    PostStore.off(POST.LOADED, this._onPostsLoaded);
  },

  componentWillReceiveProps(nextProps) {
    var posts = nextProps.allPosts;
    posts = this.prunePosts(posts);
    this.setState({
      posts: this.state.posts.cloneWithRows(posts)
    });
  },

  requestJoin() {
    // dont allow this for non logged in users
    if(!this.props.loggedIn) {
      ToastAndroid.show('Please Log In to Join a Bevy', ToastAndroid.SHORT);
      return;
    }
    // send action
    BevyActions.requestJoin(this.props.activeBevy, this.props.user);
  },

  _onPostsLoading() {
    this.setState({
      loading: true
    });
  },
  _onPostsLoaded() {
    this.setState({
      loading: false
    });
  },

  prunePosts(posts) {
    posts = _.filter(posts, (post) => {
      if(this.props.activeBevy._id == '-1') return true;
      if(post.tag == undefined) return false;
      return _.findWhere(this.props.activeTags, { name: post.tag.name }) != undefined;
    });
    return posts;
  },

  _renderHeader() {
    if(!this.props.renderHeader) return <View />;
    else return (
      <View style={ styles.header }>
        <BevyBar
          activeBevy={ this.props.activeBevy }
          bevyNavigator={ this.props.bevyNavigator }
          bevyRoute={ this.props.bevyRoute }
        />
        { this._renderNewPostCard() }
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
    if(this.props.activeBevy._id != -1 // if not the frontpage
      && this.props.activeBevy.settings.privacy == 1
      && !_.contains(this.props.user.bevies, this.props.activeBevy._id)) {
      // if this is a private bevy that the user is not a part of
      // dont show any posts. only show a request join view
      return (
        <View style={ styles.privateContainer }>
          <BevyBar
            activeBevy={ this.props.activeBevy }
            bevyNavigator={ this.props.bevyNavigator }
            bevyRoute={ this.props.bevyRoute }
            showActions={ false }
          />
          <Image
            style={ styles.privateImage }
            source={{ uri: constants.siteurl + '/img/private.png' }}
          />
          <Text style={ styles.privateText }>
            This Bevy is Private
          </Text>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#DDD', false) }
            onPress={ this.requestJoin }
          >
            <View style={ styles.requestJoinButton }>
              <Text style={ styles.requestJoinButtonText }>
                Request to Join this Bevy
              </Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      );
    }
    if(this.state.loading) {
      return (
        <View style={ styles.container }> 
          { this._renderHeader() }     
          <View style={ styles.noPostsContainer }>   
            <ProgressBarAndroid styleAttr="Inverse" />
          </View>
        </View>
      );
    } else if(_.isEmpty(this.props.allPosts) && !this.state.loading) {
      return (
        <View style={ styles.container }> 
          { this._renderHeader() }     
          <View style={ styles.noPostsContainer }>   
            <Text style={ styles.noPosts }>No Posts</Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={ styles.container }>
          <ListView
            dataSource={ this.state.posts }
            style={ styles.postList }
            scrollRenderAheadDistance={ 300 }
            removeClippedSubviews={ true }
            initialListSize={ 3 }
            pageSize={ 3 }
            renderHeader={ this._renderHeader }
            renderRow={(post) => 
              <Post
                key={ 'post:' + post._id }
                post={ post }
                mainNavigator={ this.props.mainNavigator }
                mainRoute={ this.props.mainRoute }
                user={ this.props.user }
                activeBevy={ this.props.activeBevy }
              />
            }
          />
        </View>
      );
    }
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
  noPostsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  noPosts: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    color: '#AAA'
  },
  privateContainer: {
    flex: 1,
    alignItems: 'center'
  },
  privateImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20,
    marginBottom: 15
  },
  privateText: {
    textAlign: 'center',
    color: '#AAA',
    fontSize: 22,
    marginBottom: 15
  },
  requestJoinButton: {
    backgroundColor: '#2CB673',
    borderRadius: 3,
    paddingVertical: 5,
    paddingHorizontal: 10
  },
  requestJoinButtonText: {
    color: '#FFF'
  }
});

module.exports = PostList;
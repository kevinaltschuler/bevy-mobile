/**
 * PostList.ios.js
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicatorIOS,
  Image,
  RefreshControl,
  AlertIOS
} = React;
var Spinner = require('react-native-spinkit');
var Post = require('./Post.ios.js');
var Event = require('./Event.ios.js');
var RefreshingIndicator = require('./../../../shared/components/ios/RefreshingIndicator.ios.js');
var NewPostCard = require('./NewPostCard.ios.js');
var BoardCard = require('./../../../bevy/components/ios/BoardCard.ios.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var PostStore = require('./../../../post/PostStore');
var BevyStore = require('./../../../bevy/BevyStore');
var PostActions = require('./../../../post/PostActions');
var BevyActions = require('./../../../bevy/BevyActions');

var POST = constants.POST;
var BOARD = constants.BOARD;

var PostList = React.createClass({
  propTypes: {
    allPosts: React.PropTypes.array,
    activeBevy: React.PropTypes.object,
    activeBoard: React.PropTypes.object,
    user: React.PropTypes.object,
    showNewPostCard: React.PropTypes.bool,
    profileUser: React.PropTypes.object,
    myBevies: React.PropTypes.array,
    onScroll: React.PropTypes.func,
    mainNavigator: React.PropTypes.object,
    mainRoute: React.PropTypes.object,
    useSearchPosts: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      activeBevy: {},
      allPosts: [],
      showNewPostCard: true,
      profileUser: null,
      onScroll: _.noop,
      useSearchPosts: false
    };
  },

  getInitialState() {
    return {
      ds: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }).cloneWithRows(this.props.allPosts),
      loading: false,
      loadingInitial: true,
      joined: _.contains(this.props.user.bevies, this.props.activeBevy._id),
      searchPosts: [],
      searchQuery: '',
      searching: false,
      searchError: ''
    };
  },

  componentDidMount() {
    PostStore.on(POST.LOADED, this.onPostsLoaded);
    PostStore.on(POST.LOADING, this.onPostsLoading);

    PostStore.on(POST.SEARCHING, this.onPostSearching);
    PostStore.on(POST.SEARCH_ERROR, this.onPostSearchError);
    PostStore.on(POST.SEARCH_COMPLETE, this.onPostSearchComplete);

    BevyStore.on(BOARD.SWITCHED, this.onBoardSwitched);
  },
  componentWillUnmount() {
    PostStore.off(POST.LOADED, this.onPostsLoaded);
    PostStore.off(POST.LOADING, this.onPostsLoading);

    PostStore.off(POST.SEARCHING, this.onPostSearching);
    PostStore.off(POST.SEARCH_ERROR, this.onPostSearchError);
    PostStore.off(POST.SEARCH_COMPLETE, this.onPostSearchComplete);

    BevyStore.off(BOARD.SWITCHED, this.onBoardSwitched);
  },

  onPostsLoading() {
    this.setState({ loading: true });
  },
  onPostsLoaded() {
    this.setState({
      loading: false,
      loadingInitial: false,
      ds: this.state.ds.cloneWithRows(PostStore.getAll()),
    });
    this.forceUpdate();
  },

  onPostSearching() {
    this.setState({
      searching: true,
      loading: true
    });
  },
  onPostSearchError(error) {
    this.setState({
      searching: false,
      loading: false,
      searchError: error
    })
  },
  onPostSearchComplete() {
    var posts = PostStore.getSearchPosts()
    this.setState({
      searching: false,
      loading: false,
      searchPosts: posts,
      searchQuery: PostStore.getSearchQuery(),
      ds: this.state.ds.cloneWithRows(posts)
    });
  },

  onBoardSwitched() {
    // once the board is switched, scroll back to the top of the ListView

    // dont do it if theres no rows being rendered
    if(this.state.ds.getRowCount() <= 0) return;

    this.ListView.scrollTo(0, 0);
  },

  onRefresh() {
    if(this.props.useSearchPosts) {
      PostActions.search(this.state.searchQuery, this.props.activeBevy._id);
      return;
    }
    if(_.isEmpty(this.props.activeBoard)) {
      PostActions.fetch(
        this.props.activeBevy._id,
        (!_.isEmpty(this.props.profileUser)) ? this.props.profileUser._id : null
      );
    } else {
       PostActions.fetchBoard(this.props.activeBoard._id);
    }
  },

  switchBackFromSearch() {
    this.setState({
      loadingInitial: true,
      ds: this.state.ds.cloneWithRows([])
    });
    PostActions.fetch(this.props.activeBevy._id, null);
  },

  handleScroll(y) {
    this.setState({ scrollY: y });
  },

  requestJoin() {
    // send action
    AlertIOS.alert('Request Sent!');
    BevyActions.requestJoin(this.props.activeBevy, this.props.user);
  },

  _renderBoardCard() {
    if(_.isEmpty(this.props.activeBoard)) return <View />;
    return (
      <BoardCard
        user={ this.props.user }
        board={ this.props.activeBoard }
        bevyNavigator={ this.props.bevyNavigator }
      />
    );
  },

  _renderHeader() {
    var bevy = this.props.activeBevy;
    var user = this.props.user;
    if(_.isEmpty(bevy)
      || !this.props.showNewPostCard
      || this.state.loadingInitial
      || this.props.useSearchPosts) {
      return <View/>;
    }
    return (
      <View style={ styles.cardContainer }>
        { this._renderBoardCard() }
        <NewPostCard
          user={ this.props.user }
          mainNavigator={ this.props.mainNavigator }
        />
      </View>
    );
  },

  _renderNoPosts() {
    if(!this.state.loading
      && !this.state.loadingInitial
      && this.state.ds.getRowCount() <= 0
    ) {
      return (
        <View style={ styles.noPostsContainer }>
          <Text style={ styles.noPostsText }>
            No Posts Yet
          </Text>
        </View>
      );
    } else return <View />;
  },

  _renderLoading() {
    if(this.state.loadingInitial) {
      return (
        <View style={ styles.spinnerContainer }>
          <Spinner
            isVisible={ true }
            size={ 60 }
            type={ '9CubeGrid' }
            color={ '#2cb673' }
          />
        </View>
      );
    } else return <View />
  },

  _renderPrivate() {
    return (
      <View style={ styles.privateContainer }>
        <Image
          style={ styles.privateImage }
          source={{ uri: constants.siteurl + '/img/private.png' }}
        />
        <Text style={ styles.privateText }>
          This Bevy is Private
        </Text>
        <TouchableOpacity
          activeOpacity={ 0.5 }
          onPress={ this.requestJoin }
        >
          <View style={ styles.requestJoinButton }>
            <Text style={ styles.requestJoinButtonText }>
              Request to Join this Bevy
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  },

  _renderPosts() {
    if(_.isEmpty(this.props.activeBevy.boards)) {
      return (
        <View style={ styles.noPostsContainer }>
          <Text style={[ styles.noPostsText, {marginTop: -20} ]}>
            This Bevy needs Boards
          </Text>
        </View>
      );
    }

    return (
      <ListView
        ref={ ref => { this.ListView = ref; }}
        dataSource={ this.state.ds }
        style={ styles.postContainer }
        onScroll={ ev => {
          this.props.onScroll(ev.nativeEvent.contentOffset.y);
        }}
        scrollRenderAheadDistance={ 100 }
        renderHeader={() => {
          return this._renderHeader();
        }}
        renderFooter={() => {
          return this._renderNoPosts();
        }}
        refreshControl={
          <RefreshControl
            refreshing={ this.state.loading }
            onRefresh={ this.onRefresh }
            tintColor='#AAA'
            title='Loading...'
          />
        }
        renderRow={ post => {
          return (
            <Post
              key={ 'postlist:' + post._id }
              post={ post }
              mainRoute={ this.props.mainRoute }
              mainNavigator={ this.props.mainNavigator }
              user={ this.props.user }
              searchQuery={ this.state.searchQuery }
            />
          );
        }}
      />
    );
  },

  render() {
    if(_.isEmpty(this.props.activeBevy) && _.isEmpty(this.props.profileUser)) {
      return <View/>;
    }
    if(!_.isEmpty(this.props.activeBevy) && this.props.activeBevy.settings.privacy == 'Private'
      && !_.contains(this.props.user.bevies, this.props.activeBevy._id)) {
      // if this is a private bevy that the user is not a part of
      // dont show any posts. only show a request join view
      return this._renderPrivate();
    }

    return (
      <View style={ styles.postContainer }>
        { this._renderLoading() }
        { this._renderPosts() }
      </View>
    );
  }
});


var styles = StyleSheet.create({
  postContainer: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#eee',
  },
  spinnerContainer: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    height: constants.height - 300
  },
  cardContainer: {
    backgroundColor: '#eee',
    marginBottom: -10
  },
  privateContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#eee'
  },
  privateImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 30,
    marginBottom: 15
  },
  privateText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 22,
    marginBottom: 15
  },
  requestJoinButton: {
    backgroundColor: '#2CB673',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5
  },
  requestJoinButtonText: {
    color: '#FFF',
    fontSize: 17
  },

  noPostsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100
  },
  noPostsText: {
    color: '#AAA',
    fontSize: 22,
    marginTop: 0
  }
});

module.exports = PostList;

/**
 * PostList.ios.js
 *
 * Displays a list of posts
 * Used in ProfileView, BevyView, and BevyView post search
 * Also displays the board card and new post card when appropriate
 *
 * @author kevin
 * @author albert
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
var Post = require('./Post.ios.js');
var RefreshingIndicator = require('./../../../shared/components/ios/RefreshingIndicator.ios.js');
var NewPostCard = require('./NewPostCard.ios.js');

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
      loading: true,
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

    if(_.isEmpty(this.props.allPosts))
      this.onRefresh();
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
    setTimeout(() => {
      this.setState({
        loading: false,
        ds: this.state.ds.cloneWithRows(PostStore.getAll()),
      });
    }, 250);
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
    var posts = PostStore.getSearchPosts();
    setTimeout(() => {
      this.setState({
        searching: false,
        loading: false,
        searchPosts: posts,
        searchQuery: PostStore.getSearchQuery(),
        ds: this.state.ds.cloneWithRows(posts)
      });
    }, 250);
  },

  onBoardSwitched() {
    // once the board is switched, scroll back to the top of the ListView
    // dont do it if theres no rows being rendered
    if(this.state.ds.getRowCount() <= 0) return;

    // scroll to top
    // and delay it by a bit
    setTimeout(() => {
      // dont try to scroll if its not mounted anymore
      if(this.ListView == undefined) return;

      this.ListView.scrollTo({ x: 0, y: 0 });
    }, 250);
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

  onScroll(ev) {
    this.props.onScroll(ev.nativeEvent.contentOffset.y);
  },

  switchToSearch() {
    this.setState({ loadingInitial: true });
  },

  switchBackFromSearch() {
    this.setState({ loadingInitial: true });
    PostActions.fetch(this.props.activeBevy._id, null);
  },

  _renderHeader() {
    var bevy = this.props.activeBevy;
    var user = this.props.user;
    if(_.isEmpty(bevy)
      || !this.props.showNewPostCard
      || (this.state.loading && this.state.ds.getRowCount() <= 0)
      || this.props.useSearchPosts) {
      return <View/>;
    }
    return (
      <View style={ styles.cardContainer }>
        <NewPostCard
          user={ this.props.user }
          activeBevy={ this.props.activeBevy }
          mainNavigator={ this.props.mainNavigator }
        />
      </View>
    );
  },

  _renderNoPosts() {
    if(!this.state.loading && this.state.ds.getRowCount() <= 0) {
      return (
        <View style={ styles.noPostsContainer }>
          <Text style={ styles.noPostsText }>
            No Posts Yet
          </Text>
        </View>
      );
    } else return <View />;
  },

  _renderPosts() {
    // Render this if there are no boards to post to
    // will probably only render when the user just created a new bevy
    if(_.isEmpty(this.props.activeBevy.boards) && _.isEmpty(this.props.profileUser)) {
      return (
        <View style={ styles.noPostsContainer }>
          <Text style={ styles.noPostsText }>
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
        onScroll={ this.onScroll }
        scrollRenderAheadDistance={ 100 }
        keyboardShouldPersistTaps={ !_.isEmpty(this.state.searchQuery) }
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

    return (
      <View style={ styles.postContainer }>
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

  noPostsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15
  },
  noPostsText: {
    color: '#AAA',
    fontSize: 22
  }
});

module.exports = PostList;

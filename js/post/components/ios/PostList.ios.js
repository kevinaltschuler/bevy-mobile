/**
 * PostList.ios.js
 * kevin made this
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Image
} = React;
var Spinner = require('react-native-spinkit');
var RCTRefreshControl = require('react-native-refresh-control');
var Post = require('./Post.ios.js');
var Event = require('./Event.ios.js');
var RefreshingIndicator = require('./../../../shared/components/ios/RefreshingIndicator.ios.js');
var NewPostCard = require('./NewPostCard.ios.js');
//var TagModal = require('./TagModal.ios.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var POST = constants.POST;
var PostStore = require('./../../../post/PostStore');
var BevyStore = require('./../../../bevy/BevyStore');
var PostActions = require('./../../../post/PostActions');

var SCROLLVIEW = 'ScrollView';
var LISTVIEW = 'ListView';

var PostList = React.createClass({
  propTypes: {
    allPosts: React.PropTypes.array,
    activeBevy: React.PropTypes.object,
    user: React.PropTypes.object,
    loggedIn: React.PropTypes.bool,
    authModalActions: React.PropTypes.object,
    showNewPostCard: React.PropTypes.bool,
    profileUser: React.PropTypes.object,
    showTags: React.PropTypes.bool,
    onHideTags: React.PropTypes.func,
    frontpageFilters: React.PropTypes.array,
    activeTags: React.PropTypes.array,
    myBevies: React.PropTypes.array
  },

  getDefaultProps() {
    return {
      showNewPostCard: true,
      profileUser: null,
    };
  },

  getInitialState() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }).cloneWithRows(this.props.allPosts),
      isRefreshing: true,
      loading: false
    };
  },

  setLoading() {
    this.setState({
      loading: true,
      dataSource: this.state.dataSource.cloneWithRows(['loading']),
    });
  },

  componentDidMount() {
    PostStore.on(POST.LOADED, this._onPostsLoaded);
    BevyStore.on(POST.LOADED, this._rerender);
    BevyStore.on(POST.LOADING, this.setLoading);
    PostStore.on(POST.LOADING, this.setLoading);
    PostStore.on(POST.REFRESH, this.onRefresh);
  },

  componentWillUnmount() {
    PostStore.off(POST.LOADED, this._onPostsLoaded);
    BevyStore.off(POST.LOADED, this._rerender);
    BevyStore.off(POST.LOADING, this.setLoading);
    PostStore.off(POST.LOADING, this.setLoading);
    PostStore.off(POST.POST_CREATED, this.toComments);
    PostStore.off(POST.REFRESH, this.onRefresh);
  },

  _rerender() {
    console.log('rerender');
    var allPosts = JSON.parse(JSON.stringify(PostStore.getAll()));
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(allPosts),
      loading: false
    });
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(nextProps.allPosts)
    });
  },

  _onPostsLoaded() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(PostStore.getAll()),
      loading: false
    });
  },

  onRefresh(stopRefresh) {
    PostActions.fetch(
      this.props.activeBevy._id,
      (this.props.profileUser) ? this.props.profileUser._id : null
    );
    setTimeout(stopRefresh, 2000);
  },

  handleScroll(y) {
    this.setState({
      scrollY: y
    })
  },

  requestJoin() {
    // send action
    BevyActions.requestJoin(this.props.activeBevy, this.props.user);
  },

  _renderHeader() {
    var newPostCard = (!this.props.showNewPostCard || _.isEmpty(this.props.activeBoard.name))
    ? <View/>
    : (
      <View style={styles.cardContainer}>
        <NewPostCard
          user={ this.props.user }
          loggedIn={ this.props.loggedIn }
          mainNavigator={ this.props.mainNavigator }
          authModalActions={ this.props.authModalActions }
        />
      </View>
    );
    return newPostCard;
  },

  render() {

    if(_.isEmpty(this.props.activeBevy)) {
      return <View/>;
    }

    if(this.props.activeBevy.settings.privacy == 'Private'
      && !_.contains(this.props.user.bevies, this.props.activeBevy._id)) {
      // if this is a private bevy that the user is not a part of
      // dont show any posts. only show a request join view
      return (
        <View style={ styles.privateContainer }>
          <Image
            style={ styles.privateImage }
            source={{ uri: constants.siteurl + '/img/private.png' }}
          />
          <Text style={ styles.privateText }>
            This Bevy is Private
          </Text>
          <TouchableHighlight
            onPress={ this.requestJoin }
          >
            <View style={ styles.requestJoinButton }>
              <Text style={ styles.requestJoinButtonText }>
                Request to Join this Bevy
              </Text>
            </View>
          </TouchableHighlight>
          <ListView
            onRefresh={this.onRefresh}
            ref={(ref) => {
              this.ListView = ref;
            }}
            dataSource={ this.state.dataSource }
            style={ styles.postContainer }
            onScroll={(data) => {
              this.props.onScroll(data.nativeEvent.contentOffset.y);
            }}
            scrollRenderAheadDistance={3}
            renderHeader={() => {
              return <View/>
            }}
            renderRow={(post) => {
              return <View/>;
            }}
          />
        </View>
      );
    }

    return (
      <View style={ styles.postContainer }>
    
          <RCTRefreshControl.ListView
            onRefresh={this.onRefresh}
            ref={(ref) => {
              this.ListView = ref;
            }}
            dataSource={ this.state.dataSource }
            style={ styles.postContainer }
            onScroll={(data) => {
              this.props.onScroll(data.nativeEvent.contentOffset.y);
            }}
            scrollRenderAheadDistance={100}
            renderHeader={() => {
              return this._renderHeader();
            }}
            renderFooter={() => {
              return <View style={{height: 52}}/>
            }}
            renderRow={(post) => {
              if(this.state.loading) {
                return (
                <View style={styles.spinnerContainer}>
                  <Spinner
                    isVisible={true}
                    size={40}
                    type={'Arc'}
                    color={'#2cb673'}
                  />
                </View>
                );
              }
              if(_.isEmpty(post.board)) {
                return <View/>
              }
              return <View style={{backgroundColor: '#eee'}}>
                <Post
                  key={ 'postlist:' + post._id }
                  post={ post }
                  mainRoute={ this.props.mainRoute }
                  mainNavigator={ this.props.mainNavigator }
                  user={ this.props.user }
                  authModalActions={ this.props.authModalActions }
                  loggedIn={ this.props.loggedIn }
                />
              </View>;
            }}
          />
        </View>
    );
  }
});


var styles = StyleSheet.create({
  postContainer: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#eee',
    paddingTop: 1
  },
  postListHeader: {
    flex: 1,
    flexDirection: 'column'
  },
  tagOverlay: {

  },
  spinnerContainer: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#eee',
    paddingTop: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: constants.height - 300
  },
  cardContainer: {
    height: 50,
    backgroundColor: '#eee',
    marginTop: 22,
    marginBottom: -10
  },
  listContainer: {
    flex: 1,
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
    borderColor: '#2cb673',
    borderWidth: 1,
    borderRadius: 3,
    paddingVertical: 5,
    paddingHorizontal: 10
  },
  requestJoinButtonText: {
    color: '#2cb673'
  }
})

module.exports = PostList;

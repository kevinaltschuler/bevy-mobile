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
  ActivityIndicatorIOS,
  Image
} = React;
var Spinner = require('react-native-spinkit');
var RCTRefreshControl = require('react-native-refresh-control');
var Post = require('./Post.ios.js');
var Event = require('./Event.ios.js');
var RefreshingIndicator = require('./../../../shared/components/ios/RefreshingIndicator.ios.js');
var NewPostCard = require('./NewPostCard.ios.js');
var Swiper = require('react-native-swiper-fork');

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
    activeBoard: React.PropTypes.object,
    user: React.PropTypes.object,
    showNewPostCard: React.PropTypes.bool,
    profileUser: React.PropTypes.object,
    myBevies: React.PropTypes.array,
    onScroll: React.PropTypes.func,
    mainNavigator: React.PropTypes.object,
    mainRoute: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      activeBevy: {},
      allPosts: [],
      showNewPostCard: true,
      profileUser: null,
      onScroll: _.noop
    };
  },

  getInitialState() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }).cloneWithRows(this.props.allPosts),
      isRefreshing: true,
      loading: true,
      joined: _.contains(this.props.user.bevies, this.props.activeBevy._id)
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
    PostStore.on(POST.LOADING, this.setLoading);
  },
  componentWillUnmount() {
    PostStore.off(POST.LOADED, this._onPostsLoaded);
    BevyStore.off(POST.LOADED, this._rerender);
    PostStore.off(POST.LOADING, this.setLoading);
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(nextProps.allPosts),
      loading: false
    });
  },

  _rerender() {
    var allPosts = JSON.parse(JSON.stringify(PostStore.getAll()));
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(allPosts),
      loading: false
    });
  },

  _onPostsLoaded() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(PostStore.getAll()),
      loading: false
    });
    this.forceUpdate();
  },

  onRefresh(stopRefresh) {
    PostActions.fetch(
      this.props.activeBevy._id,
      (!_.isEmpty(this.props.profileUser)) ? this.props.profileUser._id : null
    );
    setTimeout(stopRefresh, 2000);
  },

  handleScroll(y) {
    this.setState({ scrollY: y });
  },

  requestJoin() {
    // send action
    BevyActions.requestJoin(this.props.activeBevy, this.props.user);
  },

  _renderHeader() {
    var bevy = this.props.activeBevy;
    var user = this.props.user;
    if(_.isEmpty(bevy) || !this.props.showNewPostCard ) {
      return <View/>;
    }
    return (
      <View style={styles.cardContainer}>
        <NewPostCard
          user={ this.props.user }
          mainNavigator={ this.props.mainNavigator }
        />
      </View>
    );
  },

  _renderNoPosts() {
    if(!this.state.loading && _.isEmpty(this.props.allPosts)) {
      return (
        <View style={ styles.noPostsContainer }>
          <Text style={ styles.noPostsText }>
            No Posts Yet
          </Text>
        </View>
      );
    } else return <View />;
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
        </View>
      );
    }

    return (
      <View style={ styles.postContainer }>
        { this._renderNoPosts() }
        <ListView
          ref={(ref) => { this.ListView = ref; }}
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
            return <View style={{height: 20}}/>
          }}
          renderRow={(post) => {
            if(this.state.loading) {
              return (
              <View style={styles.spinnerContainer}>
                <Spinner
                  isVisible={ true }
                  size={ 40 }
                  type={ 'Arc' }
                  color={ '#2cb673' }
                />
              </View>
              );
            }
            if(_.isEmpty(post.board)) {
              return <View/>
            }
            return <View style={{ backgroundColor: '#eee' }}>
              <Post
                key={ 'postlist:' + post._id }
                post={ post }
                mainRoute={ this.props.mainRoute }
                mainNavigator={ this.props.mainNavigator }
                user={ this.props.user }
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
    marginTop: 20,
    marginBottom: 15
  },
  privateText: {
    textAlign: 'center',
    color: '#AAA',
    fontSize: 22,
    marginBottom: 15
  },



  noPostsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  noPostsText: {
    color: '#AAA',
    fontSize: 22
  }
})

module.exports = PostList;

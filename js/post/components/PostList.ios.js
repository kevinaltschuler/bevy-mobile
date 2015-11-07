/**
 * PostList.ios.js
 * kevin made this
 */
'use strict';

var React = require('react-native');
var _ = require('underscore');
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
var RCTRefreshControl = require('react-refresh-control');

var _ = require('underscore');
var constants = require('./../../constants');
var routes = require('./../../routes');
var POST = constants.POST;
var PostStore = require('./../PostStore');
var BevyStore = require('./../../bevy/BevyStore');
var PostActions = require('./../PostActions');

var Post = require('./Post.ios.js');
var Event = require('./Event.ios.js');
var RefreshingIndicator = require('./../../shared/components/RefreshingIndicator.ios.js');
var NewPostCard = require('./NewPostCard.ios.js');
var TagModal = require('./TagModal.ios.js');

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

    RCTRefreshControl.configure({
      node: this.refs[LISTVIEW],
    }, () => {
      this.onRefresh();
      setTimeout(() => {
        RCTRefreshControl.endRefreshing(this.refs[LISTVIEW]);
      }, 2000);
    });
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
    /*this.setState({
      dataSource: this.state.dataSource.cloneWithRows(nextProps.allPosts)
    });*/
  },

  _onPostsLoaded() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(PostStore.getAll()),
      loading: false
    });
  },

  onRefresh() {
    PostActions.fetch(
      this.props.activeBevy._id, 
      (this.props.profileUser) ? this.props.profileUser._id : null
    );
  },

  handleScroll(y) {
    this.setState({
      scrollY: y
    })
  },

  requestJoin() {
    // dont allow this for non logged in users
    if(!this.props.loggedIn) {
      this.props.authModalActions.open('Log In To join');
      return;
    }
    // send action
    BevyActions.requestJoin(this.props.activeBevy, this.props.user);
  },

  _renderHeader() {
    var newPostCard = (!this.props.showNewPostCard || _.isEmpty(this.props.activeBevy))
    ? <View style={{height: 0}} />
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
    return (
        { newPostCard }
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
            ref={LISTVIEW}
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
              return <View/>
            }}
          />
        </View>
      );
    }

    return (
      <View style={ styles.postContainer }>
          <TagModal 
            isVisible={this.props.showTags} 
            mainNavigator={this.props.mainNavigator}
            onHide={this.props.onHideTags}
            activeBevy={ this.props.activeBevy }
            frontpageFilters={ this.props.frontpageFilters }
            activeTags={this.props.activeTags}
            myBevies={ this.props.myBevies }
          />
          <ListView 
            ref={LISTVIEW}
            dataSource={ this.state.dataSource }
            style={ styles.postContainer }
            onScroll={(data) => {
              this.props.onScroll(data.nativeEvent.contentOffset.y);
            }}
            scrollRenderAheadDistance={3}
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
              if(_.isEmpty(post.bevy)) {
                return <View/>
              }
              if(this.props.activeBevy._id == -1) {
                if(!_.contains(this.props.frontpageFilters, post.bevy._id) && this.props.loggedIn) { 
                  //console.log("filtering by bevy", this.props.frontpageFilters, post.bevy._id);
                  return <View/>;
                }
              }
              if(this.props.activeBevy._id != -1) {
                if(post.tag == undefined)
                  return <View />;
                if(!_.contains(_.pluck(this.props.activeTags, 'name'), post.tag.name) && this.props.loggedIn) {
                  //console.log("filtering by tag", _.pluck(this.props.activeTags, 'name'), post.tag.name);
                  return <View/>;
                }
              }
              if(post.pinned && this.props.activeBevy._id == -1) {
                return <View/>;
              }
              if(post.type == 'event')
                return <View style={{backgroundColor: '#eee'}}> 
                  <Event 
                    key={ 'postlist:' + post._id } 
                    post={ post } 
                    mainRoute={ this.props.mainRoute }
                    mainNavigator={ this.props.mainNavigator }
                    user={ this.props.user }
                    authModalActions={ this.props.authModalActions }
                    loggedIn={ this.props.loggedIn }
                  />
                </View>;
              else
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
            }.bind(this)}
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
    marginTop: 2,
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

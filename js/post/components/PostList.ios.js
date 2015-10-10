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
  TouchableHighlight
} = React;

var {
  RefresherListView,
  LoadingBarIndicator
} = require('react-native-refresher');

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
    };
  },

  componentDidMount() {
    PostStore.on(POST.LOADED, this._onPostsLoaded);
    BevyStore.on(POST.LOADED, this._rerender);
  },

  componentWillUnmount() {
    PostStore.off(POST.LOADED, this._onPostsLoaded);
    BevyStore.off(POST.LOADED, this._rerender);
  },

  _rerender() {
    console.log('rerender');
    var allPosts = JSON.parse(JSON.stringify(PostStore.getAll()));
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(allPosts)
    });
  },

  componentWillReceiveProps(nextProps) {
    /*this.setState({
      dataSource: this.state.dataSource.cloneWithRows(nextProps.allPosts)
    });*/
  },

  _onPostsLoaded() {
    console.log('posts loaded');
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(PostStore.getAll())
    });
  },

  onRefresh() {
    PostActions.fetch(
      this.props.activeBevy, 
      (this.props.profileUser) ? this.props.profileUser._id : null
    );
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
          <RefresherListView 
            dataSource={ this.state.dataSource }
            style={ styles.postContainer }
            onRefresh={this.onRefresh}
            refreshOnRelease={true}
            indicator={<LoadingBarIndicator position="fixed" style={{marginTop: -10}} />}
            scrollRenderAheadDistance={3}
            renderHeader={() => { 
              return this._renderHeader();
            }}
            renderRow={(post) => {
              if(_.isEmpty(post.bevy)) {
                return <View/>
              }
              if(this.props.activeBevy._id == -1) {
                if(!_.contains(this.props.frontpageFilters, post.bevy._id)) { 
                  //console.log("filtering by bevy", this.props.frontpageFilters, post.bevy._id);
                  return <View/>;
                }
              }
              if(this.props.activeBevy._id != -1) {
                if(post.tag == undefined)
                  return <View />;
                if(!_.contains(_.pluck(this.props.activeTags, 'name'), post.tag.name)) {
                  //console.log("filtering by tag", _.pluck(this.props.activeTags, 'name'), post.tag.name);
                  return <View/>;
                }
              }
              
              if(post.type == 'event')
                return <Event 
                  key={ 'postlist:' + post._id } 
                  post={ post } 
                  mainRoute={ this.props.mainRoute }
                  mainNavigator={ this.props.mainNavigator }
                />
              else
                return <View style={{backgroundColor: '#eee'}}>
                  <Post 
                    key={ 'postlist:' + post._id } 
                    post={ post } 
                    mainRoute={ this.props.mainRoute }
                    mainNavigator={ this.props.mainNavigator }
                  />
                </View>
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
  },
  postListHeader: {
    flex: 1,
    flexDirection: 'column'
  },
  tagOverlay: {

  },
  cardContainer: {
    height: 50,
    backgroundColor: '#eee',
    marginTop: 0,
    marginBottom: -10
  },
  listContainer: {
    flex: 1,
  }
})

module.exports = PostList;

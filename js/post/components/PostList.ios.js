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

var RListView = require('react-native-refreshable-listview');
var RIndicator = RListView.RefreshingIndicator;

var _ = require('underscore');
var constants = require('./../../constants');
var routes = require('./../../routes');
var POST = constants.POST;
var PostStore = require('./../PostStore');
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
    activeTags: React.PropTypes.array
  },

  getDefaultProps() {
    return {
      showNewPostCard: true,
      profileUser: null,
    };
  },

  getInitialState() {
    return {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.props.allPosts),
      isRefreshing: true,
    };
  },

  componentDidMount() {
    PostStore.on(POST.LOADED, this._onPostsLoaded);
  },

  componentWillUnmount() {
    PostStore.off(POST.LOADED, this._onPostsLoaded);
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(nextProps.allPosts)
    });
  },

  _onPostsLoaded() {
    this.setState({
      isRefreshing: false
    });
  },

  handleScroll(e) {
    var scrollY = e.nativeEvent.contentInset.top + e.nativeEvent.contentOffset.y;
    //console.log(scrollY);
    if(this.isTouching) {
      if(scrollY < -60) {
        if(!this.state.isRefreshing) {
          this.setState({
            isRefreshing: true
          });
          this.onRefresh();
        }
      }
    }
  },

  handleResponderGrant() {
    this.isTouching = true;
  },

  handleResponderRelease() {
    this.isTouching = false;
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

  _renderHeaderWrapper(refreshingIndicator) {
    return (
      <View>
        {this._renderHeader()}
        {refreshingIndicator}
      </View>
    );
  },

  _renderList() {
    var list = (_.isEmpty(this.props.activeBevy) || _.isEmpty(this.props.allPosts))
    ? <View style={{height: 0}} />
    : (
        <RListView 
          dataSource={ this.state.dataSource }
          style={ styles.postContainer }
          loadData={this.onRefresh}
          refreshDescription="reloading"
          refreshingIndictatorComponent={<View style={{backgroundColor: '#eee', height: 50, flex: 1, width: 50}} />}
          renderHeaderWrapper={this._renderHeaderWrapper}
          scrollRenderAheadDistance={3}
          renderRow={(post) => {
            if(!_.isEmpty(post.bevy))
              if(post.type == 'event')
                return <Event 
                  key={ 'postlist:' + post._id } 
                  post={ post } 
                  mainRoute={ this.props.mainRoute }
                  mainNavigator={ this.props.mainNavigator }
                />
              else
                return  <Post 
                  key={ 'postlist:' + post._id } 
                  post={ post } 
                  mainRoute={ this.props.mainRoute }
                  mainNavigator={ this.props.mainNavigator }
                />
            else 
              return <View/>
          }}
        />
    );
    return (
      <View style={styles.listContainer}>
        { list }
      </View>
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
          />
          { this._renderList() }
      </View>
    );
  }
});


var styles = StyleSheet.create({
  postContainer: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#eee',
    paddingBottom: 40,
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

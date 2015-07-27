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

var constants = require('./../../constants');
var routes = require('./../../routes');
var POST = constants.POST;
var PostStore = require('./../PostStore');
var PostActions = require('./../PostActions');

var Post = require('./Post.ios.js');
var RefreshingIndicator = require('./../../shared/components/RefreshingIndicator.ios.js');
var NewPostCard = require('./NewPostCard.ios.js');

var PostList = React.createClass({

  propTypes: {
    allPosts: React.PropTypes.array,
    activeBevy: React.PropTypes.object
  },

  getInitialState() {
    return {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.props.allPosts),
      isRefreshing: true
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
    PostActions.fetch(this.props.activeBevy);
  },

  _renderHeader() {
    var indicator;
    if(this.state.isRefreshing) {
      indicator = (
        <RefreshingIndicator description='Loading Posts...'/>
      );
    } else {
      indicator = <View />
    }
    var newPostCard = (_.isEmpty(this.props.activeBevy) || _.isEmpty(this.props.allPosts))
    ? <View />
    : (
      <NewPostCard 
        onPress={() => {
          this.props.mainNavigator.push(routes.MAIN.NEWPOST);
        }}
      />
    );
    return (
      <View style={ styles.postListHeader }>
        { indicator }
        { newPostCard }
      </View>
    );
  },

  render() {

    return (
      <View style={ styles.postContainer }>
        <ListView 
          dataSource={ this.state.dataSource }
          onScroll={ this.handleScroll }
          onResponderGrant={ this.handleResponderGrant }
          onResponderRelease={ this.handleResponderRelease }
          style={ styles.postContainer }
          renderRow={(post) => (
            <Post 
              key={ 'postlist:' + post._id } 
              post={ post } 
              mainRoute={ this.props.mainRoute }
              mainNavigator={ this.props.mainNavigator }
            />
          )}
          renderHeader={ this._renderHeader }
        />
      </View>
    );
  }
});


var styles = StyleSheet.create({
  postContainer: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#ddd'
  },
  postListHeader: {
    flex: 1,
    flexDirection: 'column'
  },
  button: {
    width: 100,
    height: 100,
  }
})

module.exports = PostList;

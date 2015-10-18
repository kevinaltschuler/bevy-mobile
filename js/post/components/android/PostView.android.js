/**
 * PostView.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet
} = React;
var PostList = require('./PostList.android.js');
var NewPostCard = require('./NewPostCard.android.js');

var PostView = React.createClass({
  propTypes: {
    allPosts: React.PropTypes.array,
    mainNavigator: React.PropTypes.object,
    mainRoute: React.PropTypes.object,
    user: React.PropTypes.object,
    loggedIn: React.PropTypes.bool,
    activeBevy: React.PropTypes.object,
    activeTags: React.PropTypes.array
  },

  render() {
    return (
      <View style={ styles.container }>
        <PostList
          allPosts={ this.props.allPosts }
          mainNavigator={ this.props.mainNavigator }
          mainRoute={ this.props.mainRoute }
          user={ this.props.user }
          loggedIn={ this.props.loggedIn }
          showNewPostCard={ true }
          activeBevy={ this.props.activeBevy }
          activeTags={ this.props.activeTags }
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

module.exports = PostView;
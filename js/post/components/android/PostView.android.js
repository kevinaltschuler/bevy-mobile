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
    user: React.PropTypes.object,
    loggedIn: React.PropTypes.bool
  },

  render() {
    return (
      <View style={ styles.container }>
        <PostList
          allPosts={ this.props.allPosts }
          user={ this.props.user }
          loggedIn={ this.props.loggedIn }
          showNewPostCard={ true }
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
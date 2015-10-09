/**
 * Post.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,  
  Text,
  StyleSheet,
  TouchableHighlight,
  Image
} = React;
var PostHeader = require('./PostHeader.android.js');
var PostBody = require('./PostBody.android.js');
var PostImages = require('./PostImages.android.js');
var PostActions = require('./PostActions.android.js');

var _ = require('underscore');
var PostStore = require('./../../PostStore');

var Post = React.createClass({
  propTypes: {
    post: React.PropTypes.object,
    mainNavigator: React.PropTypes.object,
    mainRoute: React.PropTypes.object,
    expandText: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      post: {},
      expandText: false
    };
  },

  getInitialState() {
    return {
    };
  },

  render() {
    return (
      <View style={ styles.container }>
        <PostHeader post={ this.props.post } />
        <PostBody 
          post={ this.props.post } 
          mainNavigator={ this.props.mainNavigator }
          mainRoute={ this.props.mainRoute }
          expandText={ this.props.expandText }
        />
        <PostImages
          post={ this.props.post }
        />
        <PostActions 
          post={ this.props.post } 
          mainNavigator={ this.props.mainNavigator }
          mainRoute={ this.props.mainRoute }
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#FFF',
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 3
  }
});

module.exports = Post;
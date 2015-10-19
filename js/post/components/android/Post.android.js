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
var EventBody = require('./EventBody.android.js');

var _ = require('underscore');
var PostStore = require('./../../PostStore');

var Post = React.createClass({
  propTypes: {
    post: React.PropTypes.object,
    mainNavigator: React.PropTypes.object,
    mainRoute: React.PropTypes.object,
    expandText: React.PropTypes.bool,
    card: React.PropTypes.bool, // style like a card
    user: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      post: {},
      expandText: false,
      card: true
    };
  },

  getInitialState() {
    return {
    };
  },

  _renderBody() {
    switch(this.props.post.type) {
      case 'event':
        return (
          <EventBody
            post={ this.props.post }
            mainNavigator={ this.props.mainNavigator }
            mainRoute={ this.props.mainRoute }
            expandText={ this.props.expandText }
          />
        );
        break;
      case 'default':
      default:
        return (
          <PostBody 
            post={ this.props.post } 
            mainNavigator={ this.props.mainNavigator }
            mainRoute={ this.props.mainRoute }
            expandText={ this.props.expandText }
          />
        );
        break;
    }
  },

  _renderImages() {
    switch(this.props.post.type) {
      case 'event':
        return (
          <View />
        );
        break;
      case 'default':
      default:
        return (
          <PostImages
            post={ this.props.post }
          />
        );
        break;
    }
  },

  _renderActions() {
    if(this.props.expandText && this.props.post.type == 'event') {
      // if its event in the comment view
      // return nothing. the event body will render the action bar
      return <View />;
    } else {
      return (
        <PostActions 
          post={ this.props.post } 
          mainNavigator={ this.props.mainNavigator }
          mainRoute={ this.props.mainRoute }
          user={ this.props.user }
        />
      );
    }
  },

  render() {
    var containerStyle = (this.props.card)
      ? styles.containerCard
      : styles.containerRow;
    return (
      <View style={ containerStyle }>
        <PostHeader post={ this.props.post } />
        { this._renderBody() }
        { this._renderImages() }
        { this._renderActions() }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  containerCard: {
    flexDirection: 'column',
    backgroundColor: '#FFF',
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 3
  },
  containerRow: {
    flexDirection: 'column',
    backgroundColor: '#FFF',
    marginBottom: 10
  }
});

module.exports = Post;
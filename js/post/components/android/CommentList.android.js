/**
 * CommentList.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet
} = React;
var CommentItem = require('./CommentItem.android.js');

var CommentList = React.createClass({
  propTypes: {
    comments: React.PropTypes.array,
    user: React.PropTypes.object,
    onReply: React.PropTypes.func,
    mainNavigator: React.PropTypes.object,
    mainRoute: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      comments: []
    };
  },

  _renderComments() {
    var comments = [];
    for(var key in this.props.comments) {
      var comment = this.props.comments[key];
      comments.push(
        <CommentItem
          key={ 'comment:' + comment._id }
          comment={ comment }
          onReply={ this.props.onReply }
          user={ this.props.user }
          mainNavigator={ this.props.mainNavigator }
          mainRoute={ this.props.mainRoute }
        />
      );
    }
    return comments;
  },

  render() {
    return (
      <View style={ styles.container }>
        { this._renderComments() }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {

  }
});

module.exports = CommentList;
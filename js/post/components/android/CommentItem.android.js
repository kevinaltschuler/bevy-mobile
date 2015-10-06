/**
 * CommentItem.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var CommentList = require('./CommentList.android.js');

var _ = require('underscore');
var timeAgo = require('./../../../shared/helpers/timeAgo');

var CommentItem = React.createClass({
  propTypes: {
    comment: React.PropTypes.object,
    onReply: React.PropTypes.func,
    user: React.PropTypes.object,
    mainNavigator: React.PropTypes.object,
    mainRoute: React.PropTypes.object
  },

  getInitialState() {
    return {
      isCompact: false
    };
  },

  _renderCommentList() {
    if(_.isEmpty(this.props.comment.comments) || this.state.isCompact) return <View />;
    return (
      <CommentList
        comments={ this.props.comment.comments }
        user={ this.props.user }
        onReply={ this.props.onReply }
        mainNavigator={ this.props.mainNavigator }
        mainRoute={ this.props.mainRoute }
      />
    );
  },

  _renderComment() {
    if(this.state.isCompact) {
      return (
        <View style={ styles.comment }>
          <View style={ styles.header }>
            <Icon
              name='add'
              size={ 20 }
              color='#AAA'
              style={ styles.plusIcon }
            />
            <Text style={ styles.author }>{ this.props.comment.author.displayName }</Text>
            <Text style={ styles.timeAgo }>{ timeAgo(Date.parse(this.props.comment.created)) }</Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={ styles.comment }>
          <View style={ styles.header }>
            <Text style={ styles.author }>{ this.props.comment.author.displayName }</Text>
            <Text style={ styles.timeAgo }>{ timeAgo(Date.parse(this.props.comment.created)) }</Text>
          </View>
          <View style={ styles.body }>
            <Text style={ styles.bodyText }>{ this.props.comment.body.trim() }</Text>
          </View> 
        </View>
      );
    }
  },

  render() {
    return (
      <View style={ styles.container }>
        <TouchableWithoutFeedback
          onPress={() => {
            if(this.state.isCompact)
              this.setState({ isCompact: false });
          }}
          delayLongPress={ 750 }
          onLongPress={() => this.setState({ isCompact: !this.state.isCompact })}
        >
          { this._renderComment() }
        </TouchableWithoutFeedback>
        { this._renderCommentList() }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column'
  },
  comment: {
    backgroundColor: '#FFF',
    flexDirection: 'column',
    paddingTop: 6,
    paddingBottom: 6
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12
  },
  plusIcon: {
    marginRight: 4
  },
  author: {
    fontWeight: 'bold',
    marginRight: 4,
    color: '#888'
  },
  timeAgo: {
    color: '#AAA'
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12
  },
  bodyText: {
    color: '#888'
  }
});

module.exports = CommentItem;
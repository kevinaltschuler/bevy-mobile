'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TouchableHighlight,
  StyleSheet
} = React;
var {
  Icon
} = require('react-native-icons');

var _ = require('underscore');
var routes = require('./../../routes');
var timeAgo = require('./../../shared/helpers/timeAgo');
var colorMap = [
  '#97FF80',
  '#52C0FF',
  '#9A5DE8',
  '#FF5757',
  '#E8A341'
]; // bleached rainbow for adobe color

var Accordion = require('react-native-accordion');

var CommentItem = React.createClass({
  propTypes: {
    comment: React.PropTypes.object,
    onReply: React.PropTypes.func,
    user: React.PropTypes.object,
    mainNavigator: React.PropTypes.object
  },

  getInitialState() {
    return {
      selected: false
    };
  },

  _renderCommentList() {
    if(_.isEmpty(this.props.comment.comments)) return null;
    return (
      <CommentList
        comments={ this.props.comment.comments }
        onReply={ this.props.onReply }
        mainNavigator={ this.props.mainNavigator }
      />
    );
  },

  render() {
    return (
      <View>
        <Accordion
          ref='accordion'
          underlayColor='rgba(0,0,0,0.1)'
          animationDuration={ 200 }
          onPress={() => {
            this.setState({
              selected: !this.state.selected
            });
          }}
          header={
            <View style={[ styles.commentItem, { 
              //marginLeft: (this.props.comment.depth == 0) ? 0 : (this.props.comment.depth - 1) * 3,
              backgroundColor: (this.state.selected) ? '#eee' : '#fff',
              borderLeftColor: (this.props.comment.depth == 0) ? 'transparent' : colorMap[(this.props.comment.depth - 1) % colorMap.length],
              borderLeftWidth: (this.props.comment.depth == 0) ? 0 : (this.props.comment.depth) * 5
            }]}>
              <View style={ styles.commentItemTop }>
                <Text style={ styles.commentItemAuthor }>
                  { this.props.comment.author.displayName }
                </Text>
                <Text style={ styles.commentItemDetails }>
                  { timeAgo(Date.parse(this.props.comment.created)) }
                </Text>
              </View>
              <View style={ styles.commentItemBody }>
                <Text style={ styles.commentItemBodyText }>
                  { this.props.comment.body.trim() }
                </Text>
              </View>
            </View>
          }
          content={
            <View style={ styles.commentItemActions }>
              <TouchableHighlight
                underlayColor='rgba(0,0,0,0.1)'
                onPress={() => {
                  // bubble this comment up
                  this.props.onReply(this.props.comment);
                  // close the accordion
                  this.refs.accordion.close();
                  // unselect self
                  this.setState({
                    selected: false
                  });
                }}
                style={ styles.commentItemAction }
              >
                <Icon
                  name='ion|ios-undo'
                  size={ 20 }
                  color='#fff'
                  style={{ width: 20, height: 20 }}
                />
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor='rgba(0,0,0,0.1)'
                onPress={() => {
                  var route = routes.MAIN.PROFILE;
                  route.profileUser = this.props.comment.author;
                  this.props.mainNavigator.push(route);
                }}
                style={ styles.commentItemAction }
              >
                <Icon
                  name='ion|ios-person'
                  size={ 20 }
                  color='#fff'
                  style={{ width: 20, height: 20 }}
                />
              </TouchableHighlight>
            </View>
          }
        />
        <View style={ styles.commentItemComments }>
          { this._renderCommentList() }
        </View>
      </View>
    );
  }
});

var CommentList = React.createClass({
  propTypes: {
    comments: React.PropTypes.array,
    onReply: React.PropTypes.func,
    user: React.PropTypes.object,
    mainNavigator: React.PropTypes.object
  },

  getDefaultProps() {
    comments: []
  },

  render() {
    return (
      <View style={ styles.commentList }>
        { _.map(this.props.comments, function(comment) {
          return (
            <CommentItem
              key={ 'comment:' + comment._id }
              comment={ comment }
              onReply={ this.props.onReply }
              mainNavigator={ this.props.mainNavigator }
            />
          );
        }.bind(this)) }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  commentList: {
    flexDirection: 'column'
  },

  commentItem: {
    flexDirection: 'column',
    paddingTop: 5,
    paddingBottom: 5
  },
  commentItemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 10
  },
  commentItemAuthor: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 5
  },
  commentItemDetails: {
    fontSize: 12
  },
  commentItemBody: {
    paddingLeft: 10
  },
  commentItemBodyText: {
    fontSize: 14
  },
  commentItemComments: {

  },

  commentItemActions: {
    flexDirection: 'row',
    height: 36,
    backgroundColor: '#2CB673',
    alignItems: 'center',
  },
  commentItemAction: {
    height: 36,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

module.exports = CommentList;
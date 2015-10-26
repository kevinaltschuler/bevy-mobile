'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TouchableHighlight,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/Ionicons');

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

var Collapsible = require('react-native-collapsible');

var CommentItem = React.createClass({
  propTypes: {
    comment: React.PropTypes.object,
    onReply: React.PropTypes.func,
    user: React.PropTypes.object,
    mainNavigator: React.PropTypes.object
  },

  getInitialState() {
    return {
      collapsed: true,
      isCompact: false
    };
  },

  _renderCommentList() {
    if(_.isEmpty(this.props.comment.comments) || this.state.isCompact) return <View />;
    return (
      <CommentList
        comments={ this.props.comment.comments }
        onReply={ this.props.onReply }
        mainNavigator={ this.props.mainNavigator }
      />
    );
  },

  _renderCommentBody() {
    var commentStyle = {};
    commentStyle.borderLeftColor = 
      (this.props.comment.depth == 0)
       ? 'transparent' 
       : colorMap[(this.props.comment.depth - 1) % colorMap.length];
    commentStyle.borderLeftWidth = 
      (this.props.comment.depth == 0) 
      ? 0 
      : (this.props.comment.depth) * 5;
    commentStyle.backgroundColor = 
      (this.state.showActionBar) 
      ? '#eee' 
      : '#fff';

    if (this.state.isCompact) {
      return (
        <View style={[ styles.commentItem, commentStyle ]}>
            <View style={ styles.header }>
              <Icon
                name='ios-plus-empty'
                size={ 20 }
                color='#AAA'
                style={ styles.plusIcon }
              />
              <Text style={ styles.author }>{ this.props.comment.author.displayName }</Text>
              <Text style={ styles.timeAgo }>{ timeAgo(Date.parse(this.props.comment.created)) }</Text>
            </View>
          </View>
        );
      }
    else {
      return (
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
      );
    }
  },

  render() {


    return (
      <View>
        <View style={ styles.commentItemComments }>
          <TouchableHighlight
            underlayColor='rgba(0,0,0,0.1)'
            onPress={() => {
                if(this.state.isCompact)
                  this.setState({ isCompact: false });
                else
                  this.setState({
                    collapsed: !this.state.collapsed
                  });
            }}
            delayLongPress={ 750 }
            onLongPress={() => this.setState({ isCompact: !this.state.isCompact })}
          >
            {this._renderCommentBody()}
          </TouchableHighlight>
          <Collapsible collapsed={this.state.collapsed} >
            <View style={ styles.commentItemActions }>
              <TouchableHighlight
                underlayColor='rgba(0,0,0,0.1)'
                onPress={() => {
                  // bubble this comment up
                  this.props.onReply(this.props.comment);
                  // unselect self
                  this.setState({
                    collapsed: true
                  });
                }}
                style={ styles.commentItemAction }
              >
                <Icon
                  name='ios-undo'
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
                  name='ios-person'
                  size={ 20 }
                  color='#fff'
                  style={{ width: 20, height: 20 }}
                />
              </TouchableHighlight>
            </View>
          </Collapsible>
        </View>
        <View>
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
  },
  plusIcon: {
    marginRight: 8
  },
  author: {
    fontWeight: 'bold',
    marginRight: 4,
    color: '#888'
  },
  timeAgo: {
    color: '#AAA'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12
  },
});

module.exports = CommentList;
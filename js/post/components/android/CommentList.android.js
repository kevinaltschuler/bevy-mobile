/**
 * CommentList.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  StyleSheet
} = React;
var Collapsible = require('react-native-collapsible');
var Icon = require('react-native-vector-icons/MaterialIcons');

var _ = require('underscore');
var routes = require('./../../../routes');
var timeAgo = require('./../../../shared/helpers/timeAgo');
var colorMap = [
  '#97FF80',
  '#52C0FF',
  '#9A5DE8',
  '#FF5757',
  '#E8A341'
]; // bleached rainbow for adobe color

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
    if(_.isEmpty(this.props.comments)) return <View />;
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
      isCompact: false,
      showActionBar: false
    };
  },

  reply() {
    this.props.onReply(this.props.comment);
    this.setState({
      showActionBar: false
    });
  },

  _renderComment() {
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

    if(this.state.isCompact) {
      return (
        <View style={[ styles.comment, commentStyle ]}>
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
        <View style={[ styles.comment, commentStyle ]}>
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

  _renderActionBar() {
    return (
      <Collapsible duration={ 1000 } collapsed={ !this.state.showActionBar }>
        <View style={ styles.actionBar }>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#62D487', false) }
            onPress={() => {
              // set route user
              var route = routes.MAIN.PROFILE;
              route.user = this.props.comment.author;
              // go to profile page
              this.props.mainNavigator.push(route);
            }}
          >
            <View style={ styles.actionBarItem }>
              <Icon
                name='person'
                size={ 24 }
                color='#FFF'
              />
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#62D487', false) }
            onPress={ this.reply }
          >
            <View style={ styles.actionBarItem }>
              <Icon
                name='reply'
                size={ 24 }
                color='#FFF'
              />
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#62D487', false) }
            onPress={() => {}}
          >
            <View style={ styles.actionBarItem }>
              <Icon
                name='more-vert'
                size={ 24 }
                color='#FFF'
              />
            </View>
          </TouchableNativeFeedback>
        </View>
      </Collapsible>
    );
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


  render() {
    return (
      <View style={ styles.container }>
        <TouchableNativeFeedback
          onPress={() => {
            if(this.state.isCompact)
              this.setState({ isCompact: false });
            else
              this.setState({ showActionBar: !this.state.showActionBar });
          }}
          delayLongPress={ 750 }
          onLongPress={() => this.setState({ isCompact: !this.state.isCompact })}
        >
          { this._renderComment() }
        </TouchableNativeFeedback>
        { this._renderActionBar() }
        { this._renderCommentList() }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
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
  },
  actionBar: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2CB673'
  },
  actionBarItem: {
    height: 40,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

module.exports = CommentList;
/**
 * PostBody.ios.js
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet
} = React;

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var MAX_HEIGHT = 150;

var PostBody = React.createClass({
  propTypes: {
    post: React.PropTypes.object,
    mainRoute: React.PropTypes.object,
    mainNavigator: React.PropTypes.object,
    expandText: React.PropTypes.bool,
    searchQuery: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      expandText: false,
      searchQuery: ''
    };
  },

  getInitialState() {
    return {
      width: 0,
      height: 0
    };
  },

  onLayout(ev) {
    var layout = ev.nativeEvent.layout;
    var width = layout.width;
    var height = layout.height;

    this.setState({
      width: width,
      height: height
    });
  },

  goToCommentView() {
    // dont navigate if already in comment view
    if(this.props.mainRoute.name == routes.MAIN.COMMENT) return;
    // navigate to comments
    var route = {
      name: routes.MAIN.COMMENT,
      post: this.props.post
    };
    this.props.mainNavigator.push(route);
  },

  _renderExpandButton() {
    if(this.state.height != 0 && this.state.height > MAX_HEIGHT && !this.props.expandText) {
      return (
        <View style={ styles.showMoreRow }>
          <TouchableOpacity
            activeOpacity={ 0.5 }
            onPress={ this.goToCommentView }
          >
            <View style={ styles.showMoreButton }>
              <Text style={ styles.showMoreButtonText }>Show More</Text>
            </View>
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
        </View>
      );
    }
    else return <View />;
  },

  _renderText() {
    var title;
    if(_.isEmpty(this.props.searchQuery)) {
      title = this.props.post.title;
    } else {
      var regex = new RegExp('' + this.props.searchQuery + '', 'gi' );
      var body = this.props.post.title;
      var segments = body.split(regex);
      var replacements = body.match(regex);

      if(!replacements || !segments) {
        title = this.props.post.title
      } else {
        title = [];
        for(var key in segments) {
          var segment = segments[key];
          title.push(
            <Text
              key={ 'post:' + this.props.post._id + ':segment:' + key }
            >
              { segment }
            </Text>
          );
          // If last segment then don't add the highlight part
          if(segments.length === key + 1) return;

          title.push(
            <Text
              key={ 'post:' + this.props.post._id + ':replacement:' + key }
              style={ styles.highlightedText }
            >
              { replacements[key] }
            </Text>
          );
        }
      }
    }
    return (
      <Text
        accessible={ true }
        focusable={ true }
        style={ styles.bodyText }
        suppressHighlighting={ false }
        numberOfLines={(this.props.expandText)
          ? 9999 // arbitrary huge number
          : 8 }
      >
        { title }
      </Text>
    );
  },

  render() {
    return (
      <View
        style={ styles.body }
        accessible={ true }
        focusable={ true }
        onLayout={ this.onLayout }
      >
        { this._renderText() }
        { this._renderExpandButton() }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 15,
    paddingHorizontal: 15
  },
  bodyText: {
    fontSize: 17,
    color: '#666'
  },
  highlightedText: {
    backgroundColor: '#F0FF0F',
    paddingHorizontal: 4
  },
  showMoreRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  showMoreButton: {
    paddingVertical: 4
  },
  showMoreButtonText: {
    flex: 1,
    color: '#999',
    fontSize: 17
  }
});

module.exports = PostBody;

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
var MAX_HEIGHT = 164;

var PostBody = React.createClass({
  propTypes: {
    post: React.PropTypes.object,
    mainRoute: React.PropTypes.object,
    mainNavigator: React.PropTypes.object,
    expandText: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      expandText: false
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
    if(this.props.mainRoute.name == routes.MAIN.COMMENT.name) return;
    // navigate to comments
    var route = routes.MAIN.COMMENT;
    route.post = this.props.post;
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
    var textStyle = {};
    if(this.state.height != 0
      && this.state.height > MAX_HEIGHT
      && !this.props.expandText) {
      textStyle.height = MAX_HEIGHT;
    };

    return (
      <Text
        accessible
        style={[ styles.bodyText, textStyle ]}
      >
        { this.props.post.title }
      </Text>
    );
  },

  render() {
    return (
      <View
        style={ styles.body }
        accessible
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

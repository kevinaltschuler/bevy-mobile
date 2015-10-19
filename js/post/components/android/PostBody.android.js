/**
 * PostBody.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
	View,
  Text,
  TouchableNativeFeedback,
  StyleSheet
} = React;

var _ = require('underscore');
var routes = require('./../../../routes');
var MAX_HEIGHT = 150;

var PostBody = React.createClass({
  propTypes: {
    post: React.PropTypes.object,
    mainNavigator: React.PropTypes.object,
    mainRoute: React.PropTypes.object,
    expandText: React.PropTypes.bool
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

  _renderText() {
    var textStyle = {};
    if(this.state.height != 0 
      && this.state.height > MAX_HEIGHT 
      && !this.props.expandText) {
      textStyle.height = MAX_HEIGHT;
    };

    return (
      <Text style={[ styles.postText, textStyle ]}>
        { this.props.post.title }
      </Text>
    );
  },

  _renderExpandButton() {
    if(this.state.height != 0 
      && this.state.height > MAX_HEIGHT
      && !this.props.expandText) {
      return (
        <View style={ styles.showMoreRow }>
          <TouchableNativeFeedback
            onPress={() => {
              // dont navigate if already in comment view
              if(this.props.mainRoute.name == routes.MAIN.COMMENT.name) return;
              // navigate to comments
              var commentRoute = routes.MAIN.COMMENT;
              commentRoute.post = this.props.post;
              this.props.mainNavigator.push(commentRoute);
            }}
          >
            <View style={ styles.showMoreButton }>
              <Text style={ styles.showMoreButtonText }>Show More</Text>
            </View>
          </TouchableNativeFeedback>
          <View style={{ flex: 1 }} />
        </View>
      );
    } else {
      return <View />;
    }
  },

  render() {
    return (
      <View 
        style={ styles.container }
        onLayout={ this.onLayout }
      >
        { this._renderText() } 
        { this._renderExpandButton() }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 12,
    paddingRight: 12
  },
  postText: {
    flex: 1,
    color: '#333',
    textAlign: 'left'
  },
  showMoreRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  showMoreButton: {
    paddingVertical: 4,
    paddingHorizontal: 6
  },
  showMoreButtonText: {
    flex: 1
  }
});

module.exports = PostBody;
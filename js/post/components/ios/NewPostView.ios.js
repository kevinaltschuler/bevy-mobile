/**
 * NewPostView.ios.js
 *
 * Navigator object for creating a new post
 * Eventually need more for more post types
 *
 * @author albert
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  StyleSheet,
  Navigator,
} = React;

var _ = require('underscore');
var routes = require('./../../../routes');
var constants = require('./../../../constants');

var NewPostView = React.createClass({
  propTypes: {
    activeBoard: React.PropTypes.object,
    activeBevy: React.PropTypes.object,
    myBevies: React.PropTypes.array,
    user: React.PropTypes.object,

    // for when we are editing
    editing: React.PropTypes.bool,
    post: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      editing: false,
      post: {}
    };
  },

  getInitialState() {
    var board = (_.isEmpty(this.props.activeBoard))
      ? this.props.activeBevy.boards[0]
      : this.props.activeBoard;
    return {
      postingToBoard: board,
    };
  },

  onBoardSelected(board) {
    this.setState({ postingToBoard: board });
  },

  renderScene(route, navigator) {
    switch(route.name) {
      case routes.NEWPOST.BOARDPICKER:
        let BoardPickerView = require('./BoardPickerView.ios.js');
        return (
          <BoardPickerView
            newPostRoute={ route }
            newPostNavigator={ navigator }
            postingToBoard={ this.state.postingToBoard }
            onBoardSelected={ this.onBoardSelected }
            { ...this.props }
          />
        );
        break;

      case routes.NEWPOST.INPUT:
        let NewPostInputView = require('./NewPostInputView.ios.js');
        return (
          <NewPostInputView
            newPostRoute={ route }
            newPostNavigator={ navigator }
            postingToBoard={ this.state.postingToBoard }
            { ...this.props }
          />
        );
        break;
    }
  },

  render() {
    return (
      <Navigator
        navigator={ this.props.mainNavigator }
        initialRouteStack={[{
          name: routes.NEWPOST.INPUT
        }]}
        renderScene={ this.renderScene }
      />
    );
  }
});

var styles = StyleSheet.create({
});

module.exports = NewPostView;

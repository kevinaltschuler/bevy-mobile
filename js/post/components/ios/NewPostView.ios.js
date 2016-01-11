/**
 * NewPostView.ios.js
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
var InputView = require('./InputView.ios.js');
var CreateEventView = require('./CreateEventView.ios.js');
var DatePickerView = require('./DatePickerView.ios.js');

var _ = require('underscore');
var routes = require('./../../../routes');
var constants = require('./../../../constants');
var POST = constants.POST;
var PostActions = require('./../../../post/PostActions');
var PostStore = require('./../../../post/PostStore');

var NewPostView = React.createClass({
  propTypes: {
    activeBoard: React.PropTypes.object,
    myBevies: React.PropTypes.array,
    user: React.PropTypes.object
  },

  getInitialState() {
    return {
      datePicker: false,
      date: new Date(),
      time: new Date(),
      location: '',
    };
  },

  componentDidMount() {
    PostStore.on(POST.POST_CREATED, this.toNewPost);
  },

  componentWillUnmount() {
    PostStore.off(POST.POST_CREATED, this.toNewPost);
  },

  toNewPost(post) {
    var commentRoute = routes.MAIN.COMMENT;
    commentRoute.postID = post._id;
    this.props.mainNavigator.replace(commentRoute);
  },

  renderScene(route, navigator) {
    switch(route.name) {
      case routes.NEWPOST.DATEPICKER.name:
        return (
          <DatePickerView
            newPostRoute={ route }
            newPostNavigator={ navigator }
            date={ this.state.date }
            time={ this.state.time }
            onSetDate={(date) => {
              this.setState({ date: date });
            }}
            onSetTime={(time) => {
              this.setState({ time: time });
            }}
            { ...this.props }
          />
        );
        break;
      case routes.NEWPOST.CREATEEVENT.name:
        return (
          <CreateEventView
            newPostRoute={ route }
            newPostNavigator={ navigator }
            selected={ this.state.selected }
            tag={ this.state.tag }
            date={ this.state.date }
            time={ this.state.time }
            { ...this.props }
          />
        );
        break;
      case routes.NEWPOST.INPUT.name:
      default:
        return (
          <InputView
            newPostRoute={ route }
            newPostNavigator={ navigator }
            activeBoard={ this.props.activeBoard }
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
        initialRouteStack={[
          routes.NEWPOST.INPUT
        ]}
        initialRoute={ routes.NEWPOST.INPUT }
        renderScene={ this.renderScene }
      />
    );
  }
});

var styles = StyleSheet.create({
});

module.exports = NewPostView;

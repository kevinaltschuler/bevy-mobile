/**
 * NewPostView.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Navigator,
  StyleSheet
} = React;
var NewPostInputView = require('./NewPostInputView.android.js');
var BevyPickerView = require('./BevyPickerView.android.js');
var NewPostEventView = require('./NewPostEventView.android.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');

var NewPostView = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    myBevies: React.PropTypes.array,
    activeBevy: React.PropTypes.object,
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
    return {
      selectedBevy: (this.props.activeBevy._id == -1)
        ? this.props.myBevies[1]
        : this.props.activeBevy
    };
  },

  onSwitchBevy(bevy) {
    this.setState({
      selectedBevy: bevy
    });
  },

  render() {
    var initialRoutes = [];
    if(this.props.editing && this.props.post.type == 'event') {
      initialRoutes.push(routes.NEWPOST.CREATEEVENT);
    } else {
      initialRoutes.push(routes.NEWPOST.INPUT);
    }

    return (
      <Navigator
        configureScene={() => Navigator.SceneConfigs.FloatFromBottomAndroid}
        navigator={ this.props.mainNavigator }
        initialRouteStack={ initialRoutes }
        sceneStyle={{
          flex: 1
        }}
        renderScene={(route, navigator) => {
          switch(route.name) {
            case routes.NEWPOST.CREATEEVENT.name:
              return (
                <NewPostEventView
                  newPostRoute={ route }
                  newPostNavigator={ navigator }
                  selectedBevy={ this.state.selectedBevy }
                  editing={ this.props.editing }
                  post={ this.props.post }
                  { ...this.props }
                />
              );
              break;
            case routes.NEWPOST.BEVYPICKER.name:
              return (
                <BevyPickerView
                  newPostRoute={ route }
                  newPostNavigator={ navigator }
                  selectedBevy={ this.state.selectedBevy }
                  onSwitchBevy={ this.onSwitchBevy }
                  { ...this.props }
                />
              );
              break;
            case routes.NEWPOST.INPUT.name:
            default:
              return (
                <NewPostInputView
                  newPostRoute={ route }
                  newPostNavigator={ navigator }
                  selectedBevy={ this.state.selectedBevy }
                  editing={ this.props.editing }
                  post={ this.props.post }
                  { ...this.props }
                />
              )
              break;
          }
        }}
      />
    );
  }
});

var styles = StyleSheet.create({
});

module.exports = NewPostView;

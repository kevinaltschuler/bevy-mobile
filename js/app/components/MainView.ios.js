/**
 * MainView
 * made by kev doggity dizzle
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View
} = React;

var MainTabBar = require('./MainTabBar.ios.js');
var SearchBar = require('./../../shared/components/SearchBar.ios.js');
var NewPostView = require('./../../post/components/NewPostView.ios.js');
var CreateBevyView = require('./../../bevy/components/CreateBevyView.ios.js');
var CommentView = require('./../../post/components/CommentView.ios.js');

var routes = require('./../../routes');

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 0,
  },
});

var MainView = React.createClass({

  propTypes: {
    mainRoute: React.PropTypes.object,
    mainNavigator: React.PropTypes.object
  },

  getInitialState: function() {
    return {
      route: {}
    };
  },

  render: function() {

    switch(this.props.mainRoute.name) {

      case routes.MAIN.NEWPOST.name:
        return <NewPostView { ...this.props } />;
        break;

      case routes.MAIN.NEWBEVY.name:
        return <CreateBevyView { ...this.props } />;
        break;

      case routes.MAIN.COMMENT.name:
        return (
          <CommentView 
            postID={ this.props.mainRoute.postID || '-1' }
            { ...this.props } 
          />
        );
        break;

      case routes.MAIN.TABBAR.name:
      default:
        return <SearchBar { ...this.props } />
        break;
    }
  }
});

var styles = StyleSheet.create({

});

//module.ESPORTS LOL
module.exports = MainView;

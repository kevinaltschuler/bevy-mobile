/**
 * PostLinks.ios.js
 *
 * Renders link items for posts that contain links
 * in their title.
 *
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet
} = React;
var PostLinkItem = require('./PostLinkItem.ios.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var urlRegex = /((?:https?|ftp):\/\/[^\s/$.?#].[^\s]*)/g;
var youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;

var PostLinks = React.createClass({
  propTypes: {
    post: React.PropTypes.object,
    mainNavigator: React.PropTypes.object
  },

  getInitialState() {
    return {
      links: this.getLinks(this.props.post)
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      links: this.getLinks(nextProps.post)
    });
  },

  getLinks(post) {
    if(_.isEmpty(post.title)) return [];
    var links = post.title.match(urlRegex);
    if(!links) links = [];
    return links;
  },

  _renderLinkItems() {
    var linkItems = [];
    for(var key in this.state.links) {
      var link = this.state.links[key];
      linkItems.push(
        <PostLinkItem
          key={ 'postlink:' + link }
          link={ link }
          mainNavigator={ this.props.mainNavigator }
        />
      );
    }
    return linkItems;
  },

  render() {
    if(_.isEmpty(this.state.links)) return <View />;

    return (
      <View style={ styles.container }>
        <Text style={ styles.title }>
          Links from this post
        </Text>
        { this._renderLinkItems() }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    marginTop: 8
  },
  title: {
    color: '#AAA',
    marginBottom: 4,
    marginLeft: 10,
    fontSize: 17
  }
});

module.exports = PostLinks;

/**
 * PostLinks.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet,
  IntentAndroid,
  TouchableHighlight,
  TouchableNativeFeedback
} = React;
var Icon = require('./../../../shared/components/android/Icon.android.js');
var PostLinkItem = require('./PostLinkItem.android.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var urlRegex = /((?:https?|ftp):\/\/[^\s/$.?#].[^\s]*)/g;
var youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;

var PostLinks = React.createClass({
  propTypes: {
    post: React.PropTypes.object
  },

  getInitialState() {
    var links = this.props.post.title.match(urlRegex);
    if(!links)
      links = [];

    return {
      links: links
    };
  },

  onLinkPress(link) {
    IntentAndroid.openURL(link);
  },

  _renderLinks() {
    var linkButtons = [];
    for(var key in this.state.links) {
      var link = this.state.links[key];
      linkButtons.push(
        <PostLinkItem
          key={ 'link:' + link }
          link={ link }
          onPress={ this.onLinkPress }
        />
      );
    }
    return linkButtons;
  },

  render() {
    if(_.isEmpty(this.state.links)) {
      return <View />;
    }
    return (
      <View style={ styles.container }>
        <Text style={ styles.title }>
          Links from this post
        </Text>
        { this._renderLinks() }
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
    marginBottom: 4
  }
});

module.exports = PostLinks;

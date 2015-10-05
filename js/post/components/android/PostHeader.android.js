/**
 * PostHeader.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Image,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');

var _ = require('underscore');
var constants = require('./../../../constants');
var timeAgo = require('./../../../shared/helpers/timeAgo');

var PostHeader = React.createClass({
  propTypes: {
    post: React.PropTypes.object
  },

  render() {
    var post = this.props.post;
    var author = post.author;

    return (
      <View style={ styles.container }>
        <Image 
          source={{ uri: _.isEmpty(author.image_url) ? constants.siteurl + '/img/user-profile-icon.png' : author.image_url }}
          style={ styles.authorImage }
        />
        <View style={ styles.details }>
          <View style={ styles.authorAndBevy }>
            <Text style={ styles.authorName }>{ author.displayName }</Text>
            <Icon
              name='chevron-right'
              size={ 20 }
              color='#999'
              style={ styles.chevron }
            />
            <Text style={ styles.bevyName }>{ post.bevy.name }</Text>
          </View>
          <Text style={ styles.timeAgo }>{ timeAgo(new Date(post.created)) }</Text>
        </View>
        <View style={ styles.badges }>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 8
  },
  authorImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8
  },
  details: {
    flexDirection: 'column'
  },
  authorAndBevy: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  authorName: {

  },
  chevron: {

  },
  bevyName: {

  },
  timeAgo: {

  },
  badges: {

  }
});

module.exports = PostHeader;
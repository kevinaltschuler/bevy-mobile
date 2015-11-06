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
  TouchableWithoutFeedback,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var timeAgo = require('./../../../shared/helpers/timeAgo');
var BevyActions = require('./../../../bevy/BevyActions');

var PostHeader = React.createClass({
  propTypes: {
    post: React.PropTypes.object,
    mainNavigator: React.PropTypes.object
  },

  goToAuthorProfile() {
    var route = routes.MAIN.PROFILE;
    route.user = this.props.post.author;
    this.props.mainNavigator.push(route);
  },

  goToBevy() {
    // go back to the top view
    this.props.mainNavigator.popToTop();
    // switch bevies
    BevyActions.switchBevy(this.props.post.bevy._id);
  },

  _renderPinnedBadge() {
    if(this.props.post.pinned) {
      return (
        <View style={ styles.pinnedBadge }>
          <Text style={ styles.pinnedBadgeText }>Pinned</Text> 
        </View>
      );
    } else {
      return <View />;
    }
  },

  _renderTagBadge() {
    if(_.isEmpty(this.props.post.tag)) return <View />;
    return (
      <View style={[ styles.tagBadge, { backgroundColor: this.props.post.tag.color } ]}>
        <Text style={ styles.tagBadgeText }>
          { this.props.post.tag.name }
        </Text>
      </View>
    );
  },

  render() {
    var post = this.props.post;
    var author = post.author;

    return (
      <View style={ styles.container }>
        <TouchableWithoutFeedback
          onPress={ this.goToAuthorProfile }
        >
          <View>
            <Image 
              source={{ uri: _.isEmpty(author.image_url) 
                ? constants.siteurl + '/img/user-profile-icon.png' 
                : author.image_url }}
              style={ styles.authorImage }
            />
          </View>
        </TouchableWithoutFeedback>
        <View style={ styles.details }>
          <View style={ styles.authorAndBevy }>
            <TouchableWithoutFeedback
              onPress={ this.goToAuthorProfile }
            >
              <View>
                <Text style={ styles.authorName }>
                  { author.displayName }
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <Icon
              name='chevron-right'
              size={ 20 }
              color='#999'
              style={ styles.chevron }
            />
            <TouchableWithoutFeedback
              onPress={ this.goToBevy }
            >
              <Text style={ styles.bevyName }>{ post.bevy.name }</Text>
            </TouchableWithoutFeedback>
          </View>
          <Text style={ styles.timeAgo }>{ timeAgo(new Date(post.created)) }</Text>
        </View>
        <View style={ styles.badges }>
          { this._renderPinnedBadge() }
          { this._renderTagBadge() }
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
    flex: 1,
    flexDirection: 'column'
  },
  authorAndBevy: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  authorName: {
    fontSize: 13,
    color: '#666'
  },
  chevron: {

  },
  bevyName: {
    fontSize: 13,
    color: '#888'
  },
  timeAgo: {
    fontSize: 11
  },
  badges: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingRight: 6
  },
  pinnedBadge: {
    backgroundColor: '#AAA',
    marginRight: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8
  },
  pinnedBadgeText: {
    fontSize: 11,
    color: '#FFF'
  },
  tagBadge: {
    backgroundColor: '#AAA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8
  },
  tagBadgeText: {
    fontSize: 11,
    color: '#FFF'
  }
});

module.exports = PostHeader;
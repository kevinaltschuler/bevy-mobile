/**
 * NotificationItem.ios.js
 *
 * View for notification item
 * checks notification type and decides what to display
 * also handles the navigation when a notification is clicked
 * (only going to post is supported for now)
 *
 * @author albert
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  AlertIOS,
  TouchableHighlight,
  TouchableOpacity
} = React;

var _ = require('underscore');
var BevyStore = require('./../../../bevy/BevyStore');
var PostStore = require('./../../../post/PostStore');
var NotificationActions = require('./../../../notification/NotificationActions');
var routes = require('./../../../routes');
var constants = require('./../../../constants');
var resizeImage = require('./../../../shared/helpers/resizeImage');
var timeAgo = require('./../../../shared/helpers/timeAgo');

var NotificationItem = React.createClass({
  propTypes: {
    notification: React.PropTypes.object
  },

  getInitialState() {
    return {
      fetching: false,
      read: this.props.notification.read
    };
  },

  dismiss() {
    NotificationActions.dismiss(this.props.notification._id);
  },

  markRead() {
    NotificationActions.read(this.props.notification._id);
    this.setState({ read: true });
  },

  goToPost() {
    if(this.state.fetching) {
      return;
    }
    this.markRead();
    this.setState({
      fetching: true
    });
    var route = routes.MAIN.COMMENT;
    var post_id = this.props.notification.data.post_id;
    var post = PostStore.getPost(post_id);
    // if the post isnt already loaded, then load from the server
    if(_.isEmpty(post)) {
      fetch(constants.apiurl + '/posts/' + post_id, {
        method: 'GET'
      })
      .then(res => res.json())
      .then(res => {
        if(!_.isObject(res)) {
          this.setState({
            fetching: false
          });
          // probably just got an error fetching the post
          AlertIOS.alert('Post not found');
          return;
        }
        post = res;
        route.post = post;
        this.props.mainNavigator.push(route);
      })
      .catch(err => {
        console.log(err);
      });
    } else {
      this.setState({
        fetching: false
      });
      route.post = post;
      this.props.mainNavigator.push(route);
    }
  },

  render() {
    var notification = this.props.notification;
    var event = notification.event;
    var data = notification.data;
    var unreadStyle = (!this.state.read) ? { backgroundColor: '#EDFAF4' } : {}

    if(_.isEmpty(data.author_image)) {
      data.author_image = {
        path: constants.siteurl + '/img/user-profile-icon.png',
        foreign: true
      };
    }

    var body;
    switch(event) {
      case 'post:create':
        var author_name = data.author_name;
        var author_image = data.author_image;
        var board_id = data.board_id;
        var board_name = data.board_name;
        var post_title = data.post_title;
        var post_id = data.post_id;
        var post_created = data.post_created;

        body = (
          <TouchableOpacity
            activeOpacity={ 0.5 }
            style={ styles.notificationBody }
            onPress={ this.goToPost }
          >
            <View style={ styles.row }>
              <Image
                style={ styles.image }
                source={{ uri: resizeImage(author_image, 64, 64).url }}
              />
              <View style={ styles.textContainer }>
                <Text
                  style={ styles.bodyText }
                  numberOfLines={ 2 }
                >
                  <Text style={ styles.bold }>{ author_name }</Text>
                  {' posted to '}
                  <Text style={ styles.bold }>{ board_name }</Text>
                </Text>
                <Text style={ styles.timeAgoText }>
                  { timeAgo(Date.parse(post_created)) }
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
        break;

      case 'post:reply':
        var author_name = data.author_name;
        var author_image = data.author_image;
        var post_title = data.post_title;
        var board_name = data.board_name;
        var post_id = data.post_id;
        var comment_created = data.comment_created;

        body = (
          <TouchableOpacity
            activeOpacity={ 0.5 }
            style={ styles.notificationBody }
            onPress={ this.goToPost }
          >
            <View style={ styles.row }>
              <Image
                style={ styles.image }
                source={{ uri: resizeImage(author_image, 64, 64).url }}
              />
              <View style={ styles.textContainer }>
                <Text
                  style={ styles.bodyText }
                  numberOfLines={ 2 }
                >
                  <Text style={ styles.bold }>
                    { author_name }
                  </Text>
                  {' replied to your post In '};
                  <Text style={ styles.bold }>
                    { board_name }
                  </Text>
                </Text>
                <Text style={ styles.timeAgoText }>
                  { timeAgo(Date.parse(comment_created)) }
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
        break;

      case 'comment:reply':
        var author_name = data.author_name;
        var author_image = data.author_image;
        var parent_comment_body = data.parent_comment_body;
        var board_name = data.board_name;
        var comment_created = data.comment_created;

        body = (
          <TouchableOpacity
            activeOpacity={ 0.5 }
            style={ styles.notificationBody }
            onPress={ this.goToPost }
          >
            <View style={ styles.row }>
              <Image
                style={ styles.image }
                source={{ uri: resizeImage(author_image, 64, 64).url }}
              />
              <View style={ styles.textContainer }>
                <Text
                  style={ styles.bodyText }
                  numberOfLines={ 2 }
                >
                  <Text style={ styles.bold }>
                    { author_name }
                  </Text>
                  {' replied to your comment In '}
                  <Text style={ styles.bold }>
                    { board_name }
                  </Text>
                </Text>
                <Text style={ styles.timeAgoText }>
                  { timeAgo(Date.parse(comment_created)) }
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
        break;

      default:
        body = (
          <View>
            <Text>DEFAULT NOTIFICATION</Text>
          </View>
        );
        break;
    }

    return (
      <View style={[styles.notificationCard, unreadStyle]}>
        { body }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  notificationCard: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    height: 80,
  },
  notificationBody: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 80,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: 10
  },
  image: {
    width: 60,
    height: 60,
    backgroundColor: '#eee',
    borderRadius: 30,
    marginVertical: 10
  },
  textContainer: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'column',
    justifyContent: 'center',
    height: 80,
    paddingVertical: 8,
    marginLeft: 15,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    borderStyle: 'solid',
  },
  bodyText: {
    color: '#282929',
    flexWrap: 'wrap',
    fontSize: 17
  },
  timeAgoText: {
    fontSize: 15,
    color: '#666',
    marginTop: 3
  },
  bold: {
    fontWeight: 'bold'
  }
})

module.exports = NotificationItem;

/**
 * NotificationItem.ios.js
 * @author albert
 * @author kevin
 */

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity
} = React;
var Icon = require('react-native-vector-icons/Ionicons');

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

  dismiss() {
    NotificationActions.dismiss(this.props.notification._id);
  },

  markRead() {
    NotificationActions.read(this.props.notification._id);
  },

  goToPost() {
    this.markRead();
    var commentRoute = routes.MAIN.COMMENT;
    commentRoute.postID = this.props.notification.data.post_id;
    console.log(commentRoute);
    this.props.mainNavigator.push(commentRoute);
  },

  render() {
    var notification = this.props.notification;
    var event = notification.event;
    var data = notification.data;
    var unreadStyle = (!notification.read)
      ? { backgroundColor: '#EDFAF4' }
      : {}

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
          <View style={ styles.notificationBody }>
            <TouchableHighlight
              underlayColor='rgba(0,0,0,.1)'
              style={ styles.left }
              onPress={ this.goToPost }
            >
              <View style={ styles.row }>
                <Image
                  style={ styles.titleImage }
                  source={{ uri: resizeImage(author_image, 64, 64).url }}
                />
                <View style={styles.rightRow}>
                  <View style={styles.titleTextColumn}>
                    <Text style={styles.titleText}>
                      <Text style={{ fontWeight: 'bold' }}>{ author_name }</Text>
                      &nbsp;posted to&nbsp;
                      <Text style={{ fontWeight: 'bold' }}>{ board_name }</Text>
                      &nbsp;-&nbsp;
                      { timeAgo(Date.parse(post_created)) }
                    </Text>
                    <Text style={{  }}>
                      { post_title }
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableHighlight>
          </View>
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
          <View style={ styles.notificationBody }>
            <TouchableHighlight
              underlayColor='rgba(0,0,0,.1)'
              style={ styles.left }
              onPress={ this.goToPost }
            >
              <View style={ styles.row }>
                <Image
                  style={ styles.titleImage }
                  source={{ uri: resizeImage(author_image, 64, 64).url }}
                />
                <View style={styles.rightRow}>
                  <View style={styles.titleTextColumn}>
                    <Text style={styles.titleText}>
                      <Text style={{ fontWeight: 'bold' }}>
                        { author_name }
                      </Text>
                      &nbsp;replied to your post&nbsp;
                      <Text style={{ fontStyle: 'italic' }}>
                        { post_title }
                      </Text>
                    </Text>
                    <Text>
                      In&nbsp;
                      <Text style={{ fontWeight: 'bold' }}>
                        { board_name }
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableHighlight>
          </View>
        );
        break;

      case 'comment:reply':
        var author_name = data.author_name;
        var author_image = data.author_image;
        var parent_comment_body = data.parent_comment_body;
        var board_name = data.board_name;
        var comment_created = data.comment_created;

        body = (
          <View style={ styles.notificationBody }>
            <TouchableHighlight
              underlayColor='rgba(0,0,0,.1)'
              style={ styles.left }
              onPress={ this.goToPost }
            >
              <View style={ styles.row }>
                <Image
                  style={ styles.titleImage }
                  source={{ uri: resizeImage(author_image, 64, 64).url }}
                />
                <View style={styles.rightRow}>
                  <View style={styles.titleTextColumn}>
                    <Text style={styles.titleText}>
                      { author_name }
                      &nbsp;replied to your comment&nbsp;
                      { parent_comment_body }
                    </Text>
                    <Text>
                      In&nbsp;
                      <Text style={{ fontWeight: 'bold' }}>
                        { board_name }
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableHighlight>
          </View>
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
    height: 60,
  },
  notificationBody: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  row: {
    flexDirection: 'row'
  },
  titleImage: {
    width: 40,
    height: 40,
    backgroundColor: '#eee',
    borderRadius: 20,
  },
  rightRow: {
  	flex: 1,
  	flexDirection: 'row',
  	justifyContent: 'space-between'
  },
  titleTextColumn: {
    flexDirection: 'column',
    justifyContent: 'center',
    height: 40,
    marginLeft: 10
  },
  titleText: {
    color: '#282929'
  },
  subTitleText: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#282929'
  },
  left: {
    padding: 10,
    flex: 3,
    paddingLeft: 17
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  dismiss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 120
  },
  textWrapper: {
    width: 60
  }
})

module.exports = NotificationItem;

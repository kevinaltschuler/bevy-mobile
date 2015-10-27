/**
 * NotificationItem.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Image,
  TouchableHighlight,
  TouchableNativeFeedback,
  ToastAndroid,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');

var _ = require('underscore');
var BevyStore = require('./../../../bevy/BevyStore');
var PostStore = require('./../../../post/PostStore');
var NotificationActions = require('./../../NotificationActions');
var routes = require('./../../../routes');

var NotificationItem = React.createClass({
  propTypes: {
    notification: React.PropTypes.object,
    mainNavigator: React.PropTypes.object
  },

  dismiss() {
    NotificationActions.dismiss(this.props.notification._id);
  },

  markRead() {
    NotificationActions.read(this.props.notification._id);
  },

  goToPost() {
    /*this.markRead();
    //if(this.props.inCommentView) return;
    var commentRoute = routes.MAIN.COMMENT;
    commentRoute.postID = this.props.notification.data.post_id;
    console.log(commentRoute);
    this.props.mainNavigator.push(commentRoute);*/
    ToastAndroid.show('Feature coming soon', ToastAndroid.SHORT);
  },

  acceptJoinRequest() {

  },

  render() {
    var notification = this.props.notification;
    var event = notification.event;
    var data = notification.data;
    var unreadStyle = (!notification.read)
      ? {backgroundColor: '#EDFAF4'}
      : {};

    var body;

    switch(event) {
      case 'post:create':

        var author_name = data.author_name;
        var author_img = data.author_img;
        var bevy_id = data.bevy_id;
        var bevy_name = data.bevy_name;
        var post_title = data.post_title;
        var post_id = data.post_id;
        var post_created = data.post_created;

        if(_.isEmpty(PostStore.getPost(post_id)) || _.isEmpty(BevyStore.getBevy(bevy_id)))
          return <View/>;

        body = (
          <View style={ styles.notificationBody }>
            <TouchableNativeFeedback
              background={ TouchableNativeFeedback.Ripple('#DDD', false) }
              onPress={ this.goToPost }
            >
              <View style={styles.row}>
                <Image 
                  style={styles.titleImage}
                  source={{ uri: author_img }}
                />
                <View style={styles.rightRow}>
                  <View style={styles.titleTextColumn}>
                    <Text style={styles.titleText}>
                      Post to { bevy_name } by { author_name }
                    </Text>
                    <Text style={styles.subTitleText}>
                      { post_title }
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableNativeFeedback>
          </View>
        );
        break;

      case 'bevy:requestjoin':
        var user_id = data.user_id;
        var user_name = data.user_name;
        var user_image = data.user_image;
        var bevy_id = data.bevy_id;
        var bevy_name = data.bevy_name;

        body = (
          <View style={ styles.notificationBody }>
            <TouchableNativeFeedback
              background={ TouchableNativeFeedback.Ripple('#DDD', false) }
              onPress={ this.markRead }
            >
              <View style={styles.row}>
                <Image 
                  style={styles.titleImage}
                  source={{ uri: user_image }}
                />
                <View style={styles.rightRow}>
                  <View style={styles.titleTextColumn}>
                    <Text style={styles.titleText}>
                      Request to join { bevy_name }
                    </Text>
                    <Text style={styles.subTitleText}>
                      From { user_name }
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableNativeFeedback>

            <TouchableNativeFeedback
              background={ TouchableNativeFeedback.Ripple('#DDD', false) }
              onPress={ this.acceptJoinRequest }
            >
              <View style={styles.textWrapper}>
                <Text>
                  Accept
                </Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        );
        break;

      case 'post:reply':
        var author_name = data.author_name;
        var author_image = data.author_image;
        var post_title = data.post_title;
        var bevy_name = data.bevy_name;
        var post_id = data.post_id;
        var bevy_id = data.bevy_id;

        body = (
          <View style={ styles.notificationBody }>
            <TouchableNativeFeedback
              background={ TouchableNativeFeedback.Ripple('#DDD', false) } 
              onPress={ this.goToPost }
            >
              <View style={styles.row}>
                <Image 
                  style={styles.titleImage}
                  source={{ uri: author_image }}
                />
                <View style={styles.rightRow}>
                  <View style={styles.titleTextColumn}>
                    <Text style={styles.titleText}>
                      { author_name } replied to your post { post_title }
                    </Text>
                    <Text style={styles.subTitleText}>
                      In { bevy_name }
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableNativeFeedback>
          </View>
        );
        break;

      case 'post:commentedon':
        var author_name = data.author_name;
        var author_image = data.author_image;
        var post_title = data.post_title;
        var bevy_name = data.bevy_name;
        var post_id = data.post_id;
        var bevy_id = data.bevy_id;

        body = (
          <View style={ styles.notificationBody }>
            <TouchableNativeFeedback
              background={ TouchableNativeFeedback.Ripple('#DDD', false) }
              onPress={ this.goToPost }
            >
              <View style={styles.row}>
                <Image 
                  style={styles.titleImage}
                  source={{ uri: author_image }}
                />
                <View style={styles.rightRow}>
                  <View style={styles.titleTextColumn}>
                    <Text style={styles.titleText}>
                      { author_name } commented on a post you commented on
                    </Text>
                    <Text style={styles.subTitleText}>
                      In { bevy_name }
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableNativeFeedback>
          </View>
        );
        break;

      default:
        body = <View />;
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
    alignItems: 'center',
    height: 60,
  },
  notificationBody: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  row: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  titleImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10
  },
  rightRow: {
    height: 60,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#EEE',
    borderBottomWidth: 1
  },
  titleTextColumn: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    height: 60
  },
  titleText: {
    color: '#282929',
  },
  subTitleText: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#282929'
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
});

module.exports = NotificationItem;
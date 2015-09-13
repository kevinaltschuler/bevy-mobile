/**
 * ThreadImage.jsx
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Animated,
  TouchableHighlight,
  TouchableWithoutFeedback
} = React;

var _ = require('underscore');
var ChatStore = require('./../ChatStore');
var UserStore = require('./../../user/UserStore');

var ThreadImage = React.createClass({

  propTypes: {
    thread: React.PropTypes.object.isRequired
  },

  _renderSingleImage() {
    var image_url = ChatStore.getThreadImageURL(this.props.thread._id);
    var imageStyle = {
      width: 40,
      height: 40,
      padding: 0,
      marginLeft: 10,
      marginRight: 10,
      borderRadius: 20,
    };
    return (
      <Image style={ imageStyle } source={{uri: image_url}}/>
    );
  },

  render() {
    switch(this.props.thread.type) {
      case 'bevy':
      case 'pm':
        return this._renderSingleImage();
      case 'group':
        if(this.props.thread.image_url) {
          // if theres a set image, use that instead
          return this._renderSingleImage();
        }
        var users = [];
        var threadUsers = _.reject(this.props.thread.users, function($user) {
          // dont render self
          return $user._id == UserStore.getUser()._id;
        });
        for(var key in threadUsers) {
          if(key > 3) continue; // limit these icons to 4
          var user = threadUsers[key];
          var image_url = _.isEmpty(user.image_url) ? '/img/user-profile-icon.png' : user.image_url;
          var iconStyle = {
            flex: 1,
            padding: 0,
          };
          switch(threadUsers.length) {
            case 1:
              // only one other user
              iconStyle.width = 40;
              iconStyle.height = 40;
              iconStyle.borderRadius = 20;
              break;
            case 2:
              // two other users
              iconStyle.width = 26;
              iconStyle.height = 26;
              iconStyle.borderRadius = 13;
              iconStyle.position = 'absolute';
              if(key == 0) {
                // first user - top left
                iconStyle.top = 0;
                iconStyle.left = 0;
              } else {
                // second user - bottom right
                iconStyle.bottom = 0;
                iconStyle.right = 0;
              }
              break;
            case 3:
              // 3 other users
              iconStyle.width = 20;
              iconStyle.height = 20;
              iconStyle.borderRadius = 10;
              iconStyle.position = 'absolute';
              if(key == 0) {
                // first user - top center
                iconStyle.top = 0;
                iconStyle.left = 10;
              } else if (key == 1) {
                // second user - bottom left
                iconStyle.bottom = 0;
                iconStyle.left = 0;
              } else if (key == 2) {
                // third user - bottom right
                iconStyle.bottom = 0;
                iconStyle.right = 0;
              }
              break;
            case 4:
              // 4 other users
              iconStyle.width = 20;
              iconStyle.height = 20;
              iconStyle.borderRadius = 10;
              iconStyle.position = 'absolute';
              if(key == 0) {
                // first user - top left
                iconStyle.top = 0;
                iconStyle.left = 0;
              } else if (key == 1) {
                // second user - top right
                iconStyle.top = 0;
                iconStyle.right = 0;
              } else if (key == 2) {
                // third user - bottom left
                iconStyle.bottom = 0;
                iconStyle.left = 0;
              } else {
                // fourth user - bottom right
                iconStyle.bottom = 0;
                iconStyle.right = 0;
              }
              break;
          }
          users.push(
            <Image key={ 'threadimage:user:' + user._id } style={ iconStyle } source={{uri: image_url}}/>
          );
        }
        
        return (
          <View style={{
            position: 'relative',
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 10,
            marginLeft: 10
          }}>
            { users }
          </View>
        );
    }
  }
});

module.exports = ThreadImage;
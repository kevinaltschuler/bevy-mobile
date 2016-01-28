/**
 * ThreadImage.jsx
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Image,
} = React;

var _ = require('underscore');
var constants = require('./../../../constants');
var resizeImage = require('./../../../shared/helpers/resizeImage');
var ChatStore = require('./../../../chat/ChatStore');
var UserStore = require('./../../../user/UserStore');

var ThreadImage = React.createClass({
  propTypes: {
    thread: React.PropTypes.object.isRequired,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
  },

  getDefaultProps() {
    return {
      width: 40,
      height: 40
    };
  },

  _renderSingleImage() {
    var imageSource = ChatStore.getThreadImageSource(this.props.thread._id, 64, 64);
    var imageStyle = {
      width: this.props.width,
      height: this.props.height,
      padding: 0,
      borderRadius: Math.floor(this.props.width / 2),
      backgroundColor: '#eee'
    };
    return (
      <Image
        style={ imageStyle }
        source={ imageSource }
      />
    );
  },

  render() {
    switch(this.props.thread.type) {
      case 'board':
      case 'pm':
        return this._renderSingleImage();
      case 'group':
        if(!_.isEmpty(this.props.thread.image)) {
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
          var imageSource = UserStore.getUserImage(user.image, 64, 64);
          var iconStyle = {
            flex: 1,
            padding: 0,
            backgroundColor: '#eee'
          };
          var length = threadUsers.length;
          if(length == 1) {
              // only one other user
              iconStyle.width = this.props.width;
              iconStyle.height = this.props.height;
              iconStyle.borderRadius = Math.floor(this.props.width / 2);
          } else if(length == 2) {
              // two other users
              iconStyle.width = Math.floor(this.props.width * 0.65);
              iconStyle.height = Math.floor(this.props.height * 0.65);
              iconStyle.borderRadius = Math.floor(this.props.width * 0.325);
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
          } else if(length == 3) {
              // 3 other users
              iconStyle.width = Math.floor(this.props.width / 2);
              iconStyle.height = Math.floor(this.props.width / 2);
              iconStyle.borderRadius = Math.floor(this.props.width / 4);
              iconStyle.position = 'absolute';
              if(key == 0) {
                // first user - top center
                iconStyle.top = 0;
                iconStyle.left = Math.floor(this.props.width / 4);
              } else if (key == 1) {
                // second user - bottom left
                iconStyle.bottom = 0;
                iconStyle.left = 0;
              } else if (key == 2) {
                // third user - bottom right
                iconStyle.bottom = 0;
                iconStyle.right = 0;
              }
          } else if(length >= 4) {
              // 4 other users
              iconStyle.width = Math.floor(this.props.width / 2);
              iconStyle.height = Math.floor(this.props.height / 2);
              iconStyle.borderRadius = Math.floor(this.props.width / 4);
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
          }
          users.push(
            <Image
              key={ 'threadimage:user:' + user._id + Math.random() }
              style={ iconStyle }
              source={ imageSource }
            />
          );
        }

        return (
          <View style={{
            position: 'relative',
            width: this.props.width,
            height: this.props.height,
            borderRadius: Math.floor(this.props.width / 2)
          }}>
            { users }
          </View>
        );
    }
  }
});

module.exports = ThreadImage;

/**
 * ThreadImage.android.js
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
  TouchableHighlight,
  TouchableWithoutFeedback
} = React;

var _ = require('underscore');
var constants = require('./../../../constants');
var ChatStore = require('./../../ChatStore');
var UserStore = require('./../../../user/UserStore');
var BevyStore = require('./../../../bevy/BevyStore');

var img_default = require('./../../../images/user-profile-icon.png');

var ThreadImage = React.createClass({
  propTypes: {
    thread: React.PropTypes.object,
    size: React.PropTypes.number,
    openModal: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      size: 40,
      openModal: false
    };
  },

  getInitialState() {
    return {
      source: this.getImageSource(this.props)
    }
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      source: this.getImageSource(nextProps)
    })
  },

  openImage() {
    if(_.isEmpty(this.props.thread.image)) return;
    var actions = constants.getImageModalActions();
    constants.setImageModalImages([this.props.thread.image]);
    actions.show();
  },

  getImageSource(props) {
    var source = { uri: ChatStore.getThreadImageURL(props.thread._id, 64, 64) };
    if(source.uri == (constants.siteurl + '/img/user-profile-icon.png')) {
      source = img_default;
    } else if(source.uri == '/img/user-profile-icon.png') {
      source = img_default;
    }
    if(this.props.thread.type == 'bevy') {
      source = BevyStore.getBevyImage(props.thread.bevy._id, 30, 30);
    }
    if(_.isEmpty(source) || _.isEmpty(source.uri))
      source = img_default;

    return source;
  },

  _renderSingleImage() {
    var imageStyle = {
      width: this.props.size,
      height: this.props.size,
      padding: 0,
      marginRight: 10,
      borderRadius: this.props.size / 2,
    };
    if(this.props.openModal) {
      return (
        <TouchableWithoutFeedback
          onPress={ this.openImage }
        >
          <Image
            style={ imageStyle }
            source={ this.state.source }
          />
        </TouchableWithoutFeedback>
      );
    }
    return (
      <Image
        style={ imageStyle }
        source={ this.state.source }
      />
    );
  },

  render() {
    if(_.isEmpty(this.props.thread)) return <View />;
    switch(this.props.thread.type) {
      case 'bevy':
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
          var iconStyle = {
            flex: 1,
            padding: 0,
          };
          switch(threadUsers.length) {
            case 1:
              // only one other user
              iconStyle.width = this.props.size;
              iconStyle.height = this.props.size;
              iconStyle.borderRadius = this.props.size / 2;
              break;
            case 2:
              // two other users
              iconStyle.width = 0.65 * this.props.size;
              iconStyle.height = 0.65 * this.props.size;
              iconStyle.borderRadius = 0.325 * this.props.size;
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
              iconStyle.width = 0.5 * this.props.size;
              iconStyle.height = 0.5 * this.props.size;
              iconStyle.borderRadius = 0.25 * this.props.size;
              iconStyle.position = 'absolute';
              if(key == 0) {
                // first user - top center
                iconStyle.top = 0;
                iconStyle.left = 0.25 * this.props.size;
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
              iconStyle.width = 0.5 * this.props.size;
              iconStyle.height = 0.5 * this.props.size;
              iconStyle.borderRadius = 0.25 * this.props.size;
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
            <Image
              key={ 'threadimage:' + this.props.thread._id + ':user:' + user._id }
              style={ iconStyle }
              source={ UserStore.getUserImage(user, this.props.size, this.props.size) }
            />
          );
        }

        if(_.isEmpty(users))
          users = <View />;

        return (
          <View style={{
            width: this.props.size,
            height: this.props.size,
            borderRadius: 0.5 * this.props.size,
            marginRight: 10,
            padding: 0
          }}>
            { users }
          </View>
        );
    }
  }
});

module.exports = ThreadImage;

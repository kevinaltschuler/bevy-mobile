/**
 * PersonItem.android.js
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Image,
  StyleSheet,
  ActionSheetIOS,
  TouchableHighlight,
  TouchableOpacity
} = React;

var _ = require('underscore');
var constants = require('./../../../constants');
var resizeImage = require('./../../../shared/helpers/resizeImage');
var ChatActions = require('./../../../chat/ChatActions');

var PersonItem = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    activeThread: React.PropTypes.object,
    onSelect: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      onSelect: _.noop
    };
  },

  onSelect() {
    ActionSheetIOS.showActionSheetWithOptions({
      options: [
        'Cancel',
        'Remove "' + this.props.user.displayName + '" from this chat'
      ],
      cancelButtonIndex: 0,
    }, buttonIndex => {
      switch(buttonIndex) {
        case 1:
          this.removeUser();
          break;
      }
    });
  },

  removeUser() {
    ChatActions.removeUser(this.props.activeThread._id, this.props.user._id);
  },

  render() {
    var userImageURL = (_.isEmpty(this.props.user.image))
      ? constants.siteurl + '/img/user-profile-icon.png'
      : resizeImage(this.props.user.image, 64, 64).url;

    return (
      <TouchableOpacity
        activeOpacity={ 0.5 }
        onPress={ this.onSelect }
      >
        <View style={ styles.container }>
          <Image
            style={ styles.image }
            source={{ uri: userImageURL }}
          />
          <Text style={ styles.name }>
            { this.props.user.displayName }
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    width: constants.width,
    height: 60,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 18,
    marginRight: 10
  },
  name: {
    flex: 1,
    color: '#000',
    textAlign: 'left',
    fontSize: 17
  }
});

module.exports = PersonItem;

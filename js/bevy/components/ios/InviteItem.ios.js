/**
 * InviteItem.android.js
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');

var _ = require('underscore');
var constants = require('./../../../constants');
var resizeImage = require('./../../../shared/helpers/resizeImage');
var BevyActions = require('./../../BevyActions');

var InviteItem = React.createClass({
  propTypes: {
    invite: React.PropTypes.object,
    onRemove: React.PropTypes.func
  },

  cancelInvite() {
    var invite = this.props.invite;
    BevyActions.destroyInvite(invite._id);
  },

  acceptRequest() {
    var invite = this.props.invite;
    BevyActions.acceptRequest(invite._id);
  },

  render() {
    var invite = this.props.invite;
    console.log(invite);
    var user = invite.user;
    var userImageURL = (_.isEmpty(user.image))
      ? constants.siteurl + '/img/user-profile-icon.png'
      : resizeImage(user.image, 64, 64).url;
    var action = (invite.requestType = 'request_join')
    ? ( <TouchableOpacity
          activeOpacity={ 0.5 }
          onPress={ this.acceptRequest }
        >
          <View style={ styles.removeButton }>
            <Text style={{color: '#999'}}> 
              Accept
            </Text>
          </View>
        </TouchableOpacity>
      )
    : <TouchableOpacity
        activeOpacity={ 0.5 }
        onPress={ this.cancelInvite }
      >
        <View style={ styles.removeButton }>
          <Text style={{color: '#999'}}> 
            Cancel
          </Text>
        </View>
      </TouchableOpacity>
    return (
      <View style={ styles.addedUser }>
        <Image
          style={ styles.image }
          source={{ uri: userImageURL }}
        />
        <Text style={ styles.addedUserText }>
          { user.displayName }
        </Text>
        {action}
      </View>
    );
  }
});

var styles = StyleSheet.create({
  addedUser: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    height: 48,
    borderRadius: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
    marginBottom: 6,
    flex: 1
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10
  },
  addedUserText: {
    color: '#999',
    fontSize: 17,
    flex: 2
  },
  removeButton: {
    height: 36,
    marginLeft: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#999',
    paddingHorizontal: 10,
    paddingVertical: 0
  }
});

module.exports = InviteItem;

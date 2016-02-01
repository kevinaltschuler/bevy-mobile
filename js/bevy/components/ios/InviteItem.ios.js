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
var UserStore = require('./../../../user/UserStore');

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
    var user = invite.user;
    var userImageSource = UserStore.getUserImage(this.props.invite.user.image, 64, 64);
    var action = (invite.requestType == 'request_join')
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
          source={ userImageSource }
        />
        <Text style={ styles.addedUserText }>
          { user.displayName }
        </Text>
        { action }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  addedUser: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    height: 48,
    borderRadius: 0,
    flexDirection: 'row',
    alignItems: 'center'
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
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingHorizontal: 10,
    paddingVertical: 0
  }
});

module.exports = InviteItem;

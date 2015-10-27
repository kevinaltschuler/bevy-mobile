'use strict';

// imports
var Backbone = require('backbone');
var _ = require('underscore');

var constants = require('./../constants');
var BevyStore = require('./../bevy/BevyStore');
var UserStore = require('./../user/UserStore');

var Messages = require('./MessageCollection');

// backbone model
var ThreadModel = Backbone.Model.extend({
  idAttribute: '_id',
  initialize: function() {
    this.messages = new Messages;
    this.messages.url = constants.apiurl + '/threads/' + this.id + '/messages';

    // get bevy members later
  },
  getName() {
    if(!_.isEmpty(this.get('name'))) return this.get('name');
    switch(this.get('type')) {
      case 'bevy':
        if(!this.get('bevy')) return '';
        var bevy = BevyStore.getBevy(this.get('bevy')._id);
        return bevy.name;
        break;
      case 'group':
        var usernames = _.pluck(this.get('users'), 'displayName');
        usernames = _.reject(usernames, function($username) {
          return $username == UserStore.getUser().displayName; // dont put self in the thread name
        });
        var name = '';
        for(var key in usernames) {
          var username = usernames[key];
          name += username;
          if(key < usernames.length - 1) // remember to account for the current user being in the list
            name += ', ';
        }
        return name;
        break;
      case 'pm':
        var otherUser = _.find(this.get('users'), function($user) {
          return $user._id != UserStore.getUser()._id;
        });
        if(otherUser == undefined) return '';
        return otherUser.displayName;
        break;
    }
    // something went wrong or there's no thread type/name
    return '';
  },

   getImageURL() {
    var default_bevy_img = constants.siteurl + '/img/logo_100.png';
    var default_user_img = constants.siteurl + '/img/user-profile-icon.png';
    if(!_.isEmpty(this.get('image_url'))) return this.get('image_url');
    switch(this.get('type')) {
      case 'bevy':
        if(!this.get('bevy')) return default_bevy_img;
        var bevy = BevyStore.getBevy(this.get('bevy')._id);
        if(_.isEmpty(bevy.image_url)) return default_bevy_img;
        return bevy.image_url;
        break;
      case 'group':
        // TODO: @kevin do some magic here
        return default_user_img;
        break;
      case 'pm':
        var otherUser = _.find(this.get('users'), function($user) {
          if(_.isObject($user)) {
            return $user._id != UserStore.getUser()._id;
          } else {
            return $user == UserStore.getUser()._id;
          }
        });
        if(otherUser == undefined) return default_user_img;
        if(_.isEmpty(otherUser.image_url)) return default_user_img;
        return otherUser.image_url;
        break;
    }
    // something went wrong
    return default_user_img;
  }
});

module.exports = ThreadModel;

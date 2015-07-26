/**
 * BevyStore.js
 *
 * Backbone and React and Flux confluence
 * for bevies
 *
 * @author albert
 */

'use strict';

// imports
var Backbone = require('backbone');
//var $ = require('jquery');
var _ = require('underscore');

//var router = require('./../router');

var Dispatcher = require('./../shared/dispatcher');

//var Bevy = require('./BevyModel');
//var Bevies = require('./BevyCollection');

var Bevy = Backbone.Model.extend({
  initialize() {
    this.bevies = new Bevies;
  },
  idAttribute: '_id'
});

// backbone collection
var Bevies = Backbone.Collection.extend({
  model: Bevy
});

var constants = require('./../constants');
var BEVY = constants.BEVY;
var POST = constants.POST;
var CONTACT = constants.CONTACT;
var CHAT = constants.CHAT;
var APP = constants.APP;

var BevyActions = require('./BevyActions');

//var ChatStore = require('./../chat/ChatStore');

//var user = window.bootstrap.user;

// inherit event class first
// VERY IMPORTANT, as the PostContainer view binds functions
// to this store's events
var BevyStore = _.extend({}, Backbone.Events);

// now add some custom functions
_.extend(BevyStore, {

  myBevies: new Bevies,
  publicBevies: new Bevies,

  activeSub: -1, // id of active subbevy
  activeSuper: -1, // id of active superbevy
  subBevies: new Bevies, // sub bevies of the active bevy

  // handle calls from the dispatcher
  // these are created from BevyActions.js
  handleDispatch(payload) {
    switch(payload.actionType) {

      case APP.LOAD:
        this.myBevies.url = constants.apiurl + '/users/' + constants.getUser()._id + '/bevies';

        this.myBevies.fetch({
          reset: true,
          success: function(bevies, response, options) {
            console.log('got bevies', bevies.toJSON());
            this.myBevies.unshift({
              _id: '-1',
              name: 'Frontpage'
            });

            //this.trigger(APP.LOAD_PROGRESS, 0.1);
            this.trigger(BEVY.CHANGE_ALL);
          }.bind(this)
        });

        this.publicBevies.url = constants.apiurl + '/bevies';
        this.publicBevies.fetch({
          success: function(bevies, response, options) {
            console.log('got public bevies', bevies.toJSON());
            this.trigger(BEVY.CHANGE_ALL);
          }.bind(this)
        });

        break;

      case BEVY.FETCH_PUBLIC:
        // get list of public bevies

        this.publicBevies.url = constants.apiurl + '/bevies';
        this.publicBevies.fetch({
          success: function(bevies, response, options) {
            console.log('got public bevies', bevies.toJSON());
            this.trigger(BEVY.CHANGE_ALL);
          }.bind(this)
        });

        break;

      case BEVY.SWITCH:
        var bevy_id = payload.bevy_id;

        // look for it in my bevies
        var bevy = this.myBevies.get(bevy_id);
        if(bevy == undefined) {
          // not found. try looking in the public bevy list
          bevy = this.publicBevies.get(bevy_id);
          if(bevy == undefined) {
            // not found in public bevies
            // find in subbevies
            bevy = this.subBevies.get(bevy_id);
            if(bevy == undefined) {
              // ok, now we'll ajax
              break;
            }
          }
        }

        if(bevy.get('parent') == null) {
          // is a superbevy
          this.activeSuper = bevy.get('_id');
          this.activeSub = -1;

          // fetch subbevies, only if not frontpage
          if(this.activeSuper != -1) {
            this.subBevies.url = constants.apiurl + '/bevies/' + this.activeSuper + '/subbevies';
            this.subBevies.fetch({
              reset: true,
              success: function(subbevies, response, options) {
                this.trigger(BEVY.CHANGE_ALL);
              }.bind(this)
            });
          } else {
            // frontpage - reset subbevies
            this.subBevies.reset();
          }
        } else {
          // is a subbevy
          this.activeSuper = bevy.get('parent');
          this.activeSub = bevy.get('_id');
        }

        this.trigger(BEVY.CHANGE_ALL);
        this.trigger(BEVY.SWITCHED);

        break;

      case BEVY.CREATE:
        var name = payload.name;
        var description = payload.description;
        var image_url = payload.image_url;
        var parent = payload.parent;

        var user = constants.getUser();

        var newBevy = this.myBevies.add({
          name: name,
          description: description,
          image_url: image_url,
          parent: parent,
          admins: [ user._id ]
        });

        console.log(newBevy.toJSON());

        newBevy.save(null, {
          success: function(model, response, options) {
            // success
            newBevy.set('_id', model.id);

            this.trigger(BEVY.CREATED, newBevy.toJSON());
            this.trigger(BEVY.CHANGE_ALL);
          }.bind(this)
        });

        break;

      case BEVY.DESTROY:
        /*var id = payload.id;
        var bevy = this.bevies.get(id);
        bevy.destroy({
          success: function(model, response) {
            // switch to the frontpage
            router.navigate('/b/frontpage', { trigger: true });

            // update posts
            BevyActions.switchBevy();

            this.trigger(BEVY.CHANGE_ALL);
          }.bind(this)
        });*/

        break;

      case BEVY.UPDATE:
        /*var bevy_id = payload.bevy_id;

        var bevy = this.bevies.get(bevy_id);

        var name = payload.name || bevy.get('name');
        var description = payload.description || bevy.get('description');
        var image_url = payload.image_url || bevy.get('image_url');
        var settings = payload.settings || bevy.get('settings');

        bevy.set({
          name: name,
          description: description,
          image_url: image_url,
          settings: settings
        });

        bevy.save({
          name: name,
          description: description,
          image_url: image_url,
          settings: settings
        }, {
          patch: true
        });

        this.trigger(BEVY.CHANGE_ALL);
        this.trigger(BEVY.UPDATED_IMAGE);
        // update more stuff
        this.trigger(POST.CHANGE_ALL);
        this.trigger(CHAT.CHANGE_ALL);
        this.trigger(CONTACT.CHANGE_ALL);*/

        break;

      case BEVY.EDIT_MEMBER:
        /*var bevy_id = payload.bevy_id;
        var bevy = this.bevies.get(bevy_id);
        var members = bevy.get('members');

        var user_id = payload.user_id;
        var displayName = payload.displayName;
        var notificationLevel = payload.notificationLevel;
        var role = payload.role;
        var image_url = payload.image_url;

        var memberIndex;
        var member = _.find(members, function($member, index) {
          if($member.user._id == user_id) {
            memberIndex = index;
            return true;
          } else return false;
        });

        $.ajax({
          method: 'PATCH',
          url: constants.apiurl + '/bevies/' + bevy_id + '/members/' + member._id,
          data: {
            displayName: displayName,
            notificationLevel: notificationLevel,
            role: role,
            image_url: image_url
          },
          success: function(response) {

          }
        });


        this.trigger(BEVY.CHANGE_ALL);*/

        break;

      case BEVY.REMOVE_USER:
        /*var bevy_id = payload.bevy_id;
        var email = payload.email || '';
        var user_id = payload.user_id || '';

        var bevy = this.bevies.get(bevy_id);
        var members = bevy.get('members');

        var memberIndex;
        var member = _.find(members, function($member, index) {
          if(email == $member.email || user_id == $member.user._id) {
            memberIndex = index;
            return true;
          } else return false;
        });

        if(member == undefined || memberIndex == undefined) break;

        $.ajax({
          method: 'DELETE',
          url: constants.apiurl + '/bevies/' + bevy_id + '/members/' + member._id
        });

        members.splice(memberIndex, 1);
        bevy.set('members', members);

        this.trigger(BEVY.CHANGE_ALL);*/

        break;

      case BEVY.LEAVE:
        /*var bevy_id = payload.bevy_id;
        var bevy = this.bevies.get(bevy_id);
        var members = bevy.get('members');

        var user = window.bootstrap.user;
        var user_id = user._id;
        var email = user.email;

        var member = _.find(members, function($member, index) {
          if(!$member.user) return false; // skip members who haven't joined yet
          return (email == $member.email || user_id == $member.user._id);
        });

        if(member == undefined) break;

        $.ajax({
          method: 'DELETE',
          url: constants.apiurl + '/bevies/' + bevy_id + '/members/' + member._id,
          success: function(response) {
            // ok, now remove the bevy from the local list
            this.bevies.remove(bevy.id);
            // switch to frontpage
            router.navigate('/b/frontpage', { trigger: true });
            this.trigger(BEVY.CHANGE_ALL);
          }.bind(this)
        });*/

        break;

      

      case BEVY.INVITE:
        /*var bevy = payload.bevy;
        var user = payload.user;
        var emails = payload.members;
        var member_name = payload.member_name;

        var $bevy = this.bevies.get(bevy._id);
        var members = $bevy.get('members');

        emails.forEach(function(email) {
          $.ajax({
            method: 'POST',
            url: constants.apiurl + '/bevies/' + bevy._id + '/members',
            data: {
              email: email
            }
          });
          members.push({
            email: email
          });
        });

        $bevy.set('members', members);

        var inviter_name = (member_name && bevy.settings.anonymise_users)
        ? member_name
        : user.displayName;

        // create notification
        // which sends email
        $.post(
          constants.apiurl + '/notifications',
          {
            event: 'invite:email',
            members: emails,
            bevy_id: bevy._id,
            bevy_name: bevy.name,
            bevy_img: bevy.image_url,
            inviter_name: inviter_name
          }
        );

        this.trigger(BEVY.CHANGE_ALL);*/

        break;

      case BEVY.ADD_USER:
        /*var bevy_id = payload.bevy_id;
        var user_id = payload.user_id;
        var email = payload.email;

        $.post(
          constants.apiurl + '/bevies/' + bevy_id + '/members/',
          {
            email: email,
            user: user_id
          },
          function(data) {
            var bevy = this.bevies.get(bevy_id);
            bevy.set('members', data);
            this.trigger(BEVY.CHANGE_ALL);
          }.bind(this)
        );*/

        break;

      case BEVY.JOIN:
        /*var bevy_id = payload.bevy_id;
        var user = window.bootstrap.user;
        var email = payload.email;

        $.post(
          constants.apiurl + '/bevies/' + bevy_id + '/members/',
          {
            email: email,
            user: user._id
          },
          function(member) {
            this.bevies.fetch({
              reset: true,
              success: function(collection, response, options) {
                // add frontpage
                this.bevies.unshift({
                  _id: '-1',
                  name: 'Frontpage'
                });
                // switch to new bevy
                this.trigger(BEVY.CHANGE_ALL);
                router.navigate('/b/' + bevy_id, { trigger: true });
              }.bind(this)
            });
          }.bind(this)
        ).fail(function(jqXHR) {
          var response = jqXHR.responseJSON;
          console.log(response);
        });*/

        break;

      case BEVY.REQUEST_JOIN:
        /*var bevy = payload.bevy;
        var $user = payload.user;

        $.post(
          constants.apiurl + '/notifications',
          {
            event: 'bevy:requestjoin',
            bevy_id: bevy._id,
            bevy_name: bevy.name,
            user_id: $user._id,
            user_name: $user.displayName,
            user_image: $user.image_url,
            user_email: $user.email
          }
        );*/

        break;
    }
  },

  getMyBevies() {
    return this.myBevies.toJSON();
  },

  getPublicBevies() {
    return this.publicBevies.toJSON();
  },

  getSubBevies() {
    console.log(this.subBevies.length);
    return this.subBevies.toJSON();
  },

  getActive() {
    var bevy;
    if(this.activeSub == -1) {
      // get a superbevy
      bevy = this.myBevies.get(this.activeSuper) || this.publicBevies.get(this.activeSuper);
    } else {
      // get a subbevy
      bevy = this.subBevies.get(this.activeSub);
    }
    //console.log(bevy);
    if(bevy == undefined) return {};
    else return bevy.toJSON();
  },

  getActiveSuper() {
    var bevy = this.myBevies.get(this.activeSuper) || this.publicBevies.get(this.activeSuper);
    if(bevy == undefined) return {};
    else return bevy.toJSON();
  },

  getActiveSub() {
    var bevy = this.subBevies.get(this.activeSub);
    if(bevy == undefined) return {};
    else return bevy.toJSON();
  },

  getBevy(bevy_id) {
    // try to get from myBevies first
    var bevy = this.myBevies.get(bevy_id);
    if(bevy == undefined) {
      // now try to get from publicBevies
      bevy = this.publicBevies.get(bevy_id);
    }
    if(bevy == undefined) {
      // if still not found, return empty object
      return {};
    } else {
      return bevy.toJSON();
    }
  }
  /*
  getActiveMember: function() {
    var bevy = this.getActive();
    if(_.isEmpty(bevy)) return {};
    var members = bevy.members;
    var member = _.find(members, function(m) {
      if(!m.user) return false;
      return m.user._id == user._id;
    });
    return (member == undefined)
    ? {}
    : member;
  },

  getMembers: function() {
    var bevy = this.getActive();
    if(_.isEmpty(bevy)) return [];
    var members = bevy.members;
    return members;
  }*/
});

var dispatchToken = Dispatcher.register(BevyStore.handleDispatch.bind(BevyStore));
BevyStore.dispatchToken = dispatchToken;

module.exports = BevyStore;

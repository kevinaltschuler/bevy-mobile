/**
 * BevyStore.js
 *
 * Backbone and React and Flux confluence
 * for bevies
 *
 * @author albert
 */

'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var Dispatcher = require('./../shared/dispatcher');
var React = require('react-native');
var {
  Platform,
  ToastAndroid
} = React;
var Fletcher = require('./../shared/components/android/Fletcher.android.js');

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
var USER = constants.USER;

var BevyActions = require('./BevyActions');
var UserStore = require('./../user/UserStore');

// inherit event class first
// VERY IMPORTANT, as the PostContainer view binds functions
// to this store's events
var BevyStore = _.extend({}, Backbone.Events);

// now add some custom functions
_.extend(BevyStore, {

  myBevies: new Bevies,
  publicBevies: new Bevies,
  searchQuery: '',
  searchList: new Bevies,
  active: -1, // id of active bevy
  subBevies: new Bevies, // sub bevies of the active bevy
  activeTags: [],
  frontpageFilters: [],

  // handle calls from the dispatcher
  // these are created from BevyActions.js
  handleDispatch(payload) {
    switch(payload.actionType) {

      case APP.LOAD:
        var user = UserStore.getUser();
        // push the frontpage first to reduce UI lag
        // dont worry this wont create dupes. the fetch calls
        // should reset the store anyways
        this.myBevies.unshift({
          _id: '-1',
          name: 'Frontpage'
        });
        if(!_.isEmpty(user._id)) {
          // explicitly set the collection url for the user
          this.myBevies.url = constants.apiurl + '/users/' + user._id + '/bevies';

          // trigger loading event
          this.trigger(BEVY.LOADING);

          this.myBevies.fetch({
            reset: true,
            success: function(bevies, response, options) {
              // add the dummy frontpage bevy to the collection - for ui purposes
              this.myBevies.unshift({
                _id: '-1',
                name: 'Frontpage'
              });
              // set frontpage filters - for filtering by bevy on the frontpage
              this.frontpageFilters = _.pluck(bevies.toJSON(), '_id');
              // exclude the frontpage in the filter list
              this.frontpageFilters = _.reject(
                this.frontpageFilters, 
                function(bevy_id){ 
                  return bevy_id == -1;
                }
              );
              var collection = this.myBevies;
              collection.comparator = this.sortByAbc;
              collection.sort();

              // trigger finished events
              this.trigger(BEVY.CHANGE_ALL);
              this.trigger(BEVY.LOADED);
            }.bind(this)
          });
        } else {
          // still push the frontpage bevy to non logged in users
          this.myBevies.unshift({
            _id: '-1',
            name: 'Frontpage'
          });
        }
        // load public bevies
        this.publicBevies.url = constants.apiurl + '/bevies';
        // trigger loading event
        this.trigger(BEVY.LOADING);

        this.publicBevies.fetch({
          reset: true,
          success: function(bevies, response, options) {
            this.trigger(BEVY.CHANGE_ALL);
            this.trigger(BEVY.LOADED);
          }.bind(this)
        });
        // trigger immediately anyways
        this.trigger(BEVY.CHANGE_ALL);

        break;
      case USER.LOGOUT:
        this.myBevies.reset();
        break;

      case BEVY.SWITCH:
        var bevy_id = payload.bevy_id;

        this.trigger(BEVY.NAV_POSTVIEW);

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

        // set active field
        this.active = bevy.get('_id');
        this.activeTags = bevy.get('tags');

        this.trigger(BEVY.CHANGE_ALL);
        this.trigger(BEVY.SWITCHED);

        break;

      case BEVY.CREATE:
        var name = payload.name;
        var description = payload.description;
        var image_url = payload.image_url;
        var slug = payload.slug;

        var user = UserStore.getUser();

        var newBevy = this.myBevies.add({
          name: name,
          description: description,
          image_url: image_url,
          admins: [ user._id ],
          slug: slug
        });

        newBevy.save(null, {
          success: function(model, response, options) {
            // success
            newBevy.set('_id', model.id);

            this.trigger(BEVY.CREATED, model.toJSON());
            this.trigger(BEVY.CHANGE_ALL);
          }.bind(this)
        });

        break;

      case BEVY.DESTROY:
        var bevy_id = payload.bevy_id;

        var bevy = this.myBevies.get(bevy_id);
        if(bevy == undefined) break;

        bevy.destroy({
          success: function(model, response, options) {
            this.trigger(BEVY.CHANGE_ALL);
          }.bind(this)
        });
        break;

      case BEVY.SUBSCRIBE:
        var bevy_id = payload.bevy_id;
        var bevy = this.publicBevies.get(bevy_id);
        if(bevy == undefined) return; // not found

        this.myBevies.add(bevy);
        this.trigger(BEVY.CHANGE_ALL);
        break;
      case BEVY.UNSUBSCRIBE:
        var bevy_id = payload.bevy_id;
        var bevy = this.myBevies.get(bevy_id);
        if(bevy == undefined) return;

        this.myBevies.remove(bevy_id);
        this.trigger(BEVY.CHANGE_ALL);
        break;

      case BEVY.UPDATE:
        var bevy_id = payload.bevy_id;

        var bevy = this.myBevies.get(bevy_id);
        if(bevy == undefined) break;

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

        break;

      case BEVY.REQUEST_JOIN:
        var bevy = payload.bevy;
        var user = payload.user;

        if(Platform.OS == 'android') {
          Fletcher.fletch(constants.apiurl + '/notifications', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Content-Encoding': 'gzip'
            },
            body: JSON.stringify({
              event: 'bevy:requestjoin',
              bevy_id: bevy._id,
              bevy_name: bevy.name,
              user_id: user._id,
              user_name: user.displayName,
              user_image: user.image_url,
              user_email: user.email
            })
          }, function(error) {
            console.error(error);
          }, function(response) {
            ToastAndroid.show('Request Sent', ToastAndroid.SHORT);
          }.bind(this));
        } else {

        }
        break;

      case BEVY.SEARCH:
        var query = payload.query;
        this.searchQuery = query;
        this.searchList.reset();
        this.trigger(BEVY.SEARCHING);
        this.searchList.url = constants.apiurl + '/bevies/search/' + query;
        this.searchList.fetch({
          reset: true,
          success: function(collection, response, options) {
            this.trigger(BEVY.SEARCH_COMPLETE);
          }.bind(this)
        });
        break;

      case BEVY.UPDATE_TAGS:
        var tags = payload.tags || [];
        this.activeTags = tags;
        this.trigger(BEVY.CHANGE_ALL);
        this.trigger(POST.CHANGE_ALL);
        this.trigger(POST.LOADED);
        break;

      case BEVY.UPDATE_FRONT:
        var bevies = payload.bevies || [];
        //console.log('old', this.frontpageFilters);
        //console.log('new', bevies);
        this.frontpageFilters = bevies;
        this.trigger(POST.CHANGE_ALL);
        this.trigger(BEVY.CHANGE_ALL);
        this.trigger(POST.LOADED);

        break;
    }
  },

  getMyBevies() {
    if(this.myBevies == undefined) return [];
    return this.myBevies.toJSON();
  },

  getFrontpageFilters() {
    if(this.frontpageFilters == undefined) return [];
    return this.frontpageFilters;
  },

  getActiveTags() {
    return this.activeTags;
  },

  getPublicBevies() {
    if(this.publicBevies == undefined) return [];
    return this.publicBevies.toJSON();
  },

  getSearchList() {
    return (this.searchList.models.length <= 0)
    ? []
    : this.searchList.toJSON();
  },

  getSearchQuery() {
    return this.searchQuery;
  },

  getActive() {
    var bevy = this.getBevy(this.active);
    if(bevy == undefined) return {};
    else return bevy;
  },

  sortByAbc(bevy) {
    var name = bevy.attributes.name.toLowerCase();
    var nameValue = name.charCodeAt(0);
    return nameValue;
  },

  getBevy(bevy_id) {
    // try to get from myBevies first
    if(bevy_id == -1) {
      return {
        _id: '-1',
        name: 'Frontpage'
      }
    }
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
  },

  getBevyImage(bevy_id) {
    if(bevy_id == -1) return '';
    var bevy = this.myBevies.get(bevy_id) || this.publicBevies.get(bevy_id);
    if(bevy == undefined) return '';
    var bevy_id = bevy.get('_id');
    var default_bevies = [
      '11sports',
      '22gaming',
      '3333pics',
      '44videos',
      '555music',
      '6666news',
      '777books'
    ];
    if(_.contains(default_bevies, bevy_id)) {
      return constants.siteurl + bevy.get('image_url');
    }
    return bevy.get('image_url');
  },

  addBevy(bevy) {
    this.myBevies.add(bevy);
  }
});

var dispatchToken = Dispatcher.register(BevyStore.handleDispatch.bind(BevyStore));
BevyStore.dispatchToken = dispatchToken;

module.exports = BevyStore;

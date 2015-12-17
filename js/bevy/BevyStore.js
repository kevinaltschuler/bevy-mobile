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
  model: Bevy,
  comparator: bevy => bevy.get('name').toLowerCase() // sort alphabetically and
                                                     // ignore case
});

var constants = require('./../constants');
var BEVY = constants.BEVY;
var POST = constants.POST;
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
              this.myBevies.sort();

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
        var image = payload.image;
        var slug = payload.slug;
        var user = UserStore.getUser();

        // create and add to my bevies list
        var newBevy = this.myBevies.add({
          name: name,
          description: description,
          image: image,
          admins: [ user._id ], // add self as admin
          slug: slug
        });

        // save to server
        newBevy.save(null, {
          success: function(model, response, options) {
            // success - populate fields
            newBevy.set('_id', model.get('_id'));
            newBevy.set('admins', [ user ]);
            // trigger changes for front-end
            this.trigger(BEVY.CHANGE_ALL);
            this.trigger(BEVY.CREATED, newBevy.toJSON());
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
        var image = payload.image || bevy.get('image');
        var settings = payload.settings || bevy.get('settings');

        bevy.set({
          name: name,
          description: description,
          image: image,
          settings: settings
        });

        bevy.save({
          name: name,
          description: description,
          image: image,
          settings: settings
        }, {
          patch: true
        });

        this.trigger(BEVY.CHANGE_ALL);
        break;

      case BEVY.REQUEST_JOIN:
        var bevy = payload.bevy;
        var user = payload.user;

        fetch(constants.apiurl + '/notifications', {
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
        })
        .then(res => res.json())
        .then(res => {
          if(Platform.OS === 'android') {
            ToastAndroid.show('Request Sent', ToastAndroid.SHORT);
          } else {
            // alert ios here
          }
        });
        break;

      case BEVY.ADD_USER:
        var bevy_id = payload.bevy_id;
        var user_id = payload.user_id;

        fetch(constants.apiurl + '/users/' + user_id + '/addbevy/' + bevy_id, {
          method: 'PATCH',
          body: ''
        })
        .then(res => res.json())
        .then(res => {
          this.trigger(BEVY.CHANGE_ALL);
        });
        break;

      case BEVY.SEARCH:
        var query = payload.query;
        query = encodeURIComponent(query);
        this.searchQuery = query;
        this.searchList.reset();
        this.trigger(BEVY.SEARCHING);

        if(_.isEmpty(query)) {
          // if theres no query
          // then just return public bevies
          this.searchList.reset(this.publicBevies.models);
          this.trigger(BEVY.SEARCH_COMPLETE);
          break;
        }

        this.searchList.url = constants.apiurl + '/bevies/search/' + query;
        this.searchList.fetch({
          reset: true,
          success: function(collection, response, options) {
            this.trigger(BEVY.SEARCH_COMPLETE);
          }.bind(this),
          error: function(error) {
            this.trigger(BEVY.SEARCH_ERROR, error);
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

      case BEVY.ADD_TAG:
        var bevy_id = payload.bevy_id;
        var name = payload.name;
        var color = payload.color;

        var bevy = this.myBevies.get(bevy_id);
        if(bevy == undefined) break;

        var tags = bevy.get('tags');
        tags.push({
          name: name,
          color: color
        });
        bevy.set('tags', tags);
        bevy.save({
          tags: tags
        }, {
          patch: true,
          success: function(model, response, options) {
          }
        });
        this.trigger(BEVY.CHANGE_ALL);
        break;

      case BEVY.REMOVE_TAG:
        var bevy_id = payload.bevy_id;
        var name = payload.name;

        var bevy = this.myBevies.get(bevy_id);
        if(bevy == undefined) break;

        var tags = bevy.get('tags');
        tags = _.reject(tags, tag => tag.name == name);
        bevy.set('tags', tags);
        bevy.save({
          tags: tags
        }, {
          patch: true,
          success: function(model, response, options) {

          }
        });
        this.trigger(BEVY.CHANGE_ALL);
        break;

      case BEVY.ADD_ADMIN:
        var bevy_id = payload.bevy_id;
        var admin = payload.admin;

        var bevy = this.myBevies.get(bevy_id);
        if(bevy == undefined) break;

        var admins = bevy.get('admins');
        admins.push(admin);
        bevy.set('admins', admins);
        bevy.save({
          admins: _.pluck(admins, '_id')
        }, {
          patch: true,
          success: function(model, response, options) {
          }
        });
        this.trigger(BEVY.CHANGE_ALL);
        break;

      case BEVY.REMOVE_ADMIN:
        var bevy_id = payload.bevy_id;
        var admin_id = payload.admin_id;

        var bevy = this.myBevies.get(bevy_id);
        if(bevy == undefined) break;

        var admins = bevy.get('admins');
        admins = _.reject(admins, admin => admin._id == admin_id);
        bevy.set('admins', admins);
        bevy.save({
          admins: _.pluck(admins, '_id')
        }, {
          patch: true,
          success: function(model, response, options) {
          }
        });
        this.trigger(BEVY.CHANGE_ALL);
        break;

      case BEVY.ADD_RELATED:
        var bevy_id = payload.bevy_id;
        var new_bevy = payload.new_bevy;

        var bevy = this.myBevies.get(bevy_id);
        if(bevy == undefined) break;

        var siblings = bevy.get('siblings');
        siblings.push(new_bevy._id);
        bevy.set('siblings', siblings);
        bevy.save({
          siblings: siblings
        }, {
          patch: true
        });
        this.trigger(BEVY.CHANGE_ALL);
        break;

      case BEVY.REMOVE_RELATED:
        var bevy_id = payload.bevy_id;
        var related_id = payload.related_id;

        var bevy = this.myBevies.get(bevy_id);
        if(bevy == undefined) break;

        var siblings = bevy.get('siblings');
        siblings = _.reject(siblings, sibling => sibling._id == related_id);
        bevy.set('siblings', siblings);
        bevy.save({
          siblings: _.pluck(siblings, '_id')
        }, {
          patch: true
        });
        this.trigger(BEVY.CHANGE_ALL);
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
    return (_.isEmpty(this.searchQuery))
      ? this.publicBevies.toJSON()
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

  getBevyImage(bevy_id, width, height) {
    var default_img = require('./../images/logo_200.png');
    if(bevy_id == -1) return default_img;
    var bevy = this.myBevies.get(bevy_id) || this.publicBevies.get(bevy_id);
    if(bevy == undefined) return default_img;
    var default_bevies = [
      '11sports',
      '22gaming',
      '3333pics',
      '44videos',
      '555music',
      '6666news',
      '777books'
    ];

    var source = { uri: (_.isEmpty(bevy.get('image')))
      ? ''
      : bevy.get('image').path };
    var default_bevy_index = default_bevies.indexOf(bevy_id);

    if(source.uri.slice(7, 23) == 'api.joinbevy.com'
      && width != undefined
      && height != undefined) {
      source.uri += '?w=' + width + '&h=' + height;
    }
    if(_.isEmpty(source.uri)) {
      source = default_img;
    }
    if(default_bevy_index > -1) {
      switch(default_bevy_index) {
        case 0:
          source = require('./../images/default_groups/sports.png');
          break;
        case 1:
          source = require('./../images/default_groups/gaming.png');
          break;
        case 2:
          source = require('./../images/default_groups/pictures.png');
          break;
        case 3:
          source = require('./../images/default_groups/videos.png');
          break;
        case 4:
          source = require('./../images/default_groups/music.png');
          break;
        case 5:
          source = require('./../images/default_groups/news.png');
          break;
        case 6:
          source = require('./../images/default_groups/books.png');
          break;
      }
    }
    return source;
  },

  addBevy(bevy) {
    this.myBevies.add(bevy);
  }
});

var dispatchToken = Dispatcher.register(BevyStore.handleDispatch.bind(BevyStore));
BevyStore.dispatchToken = dispatchToken;

module.exports = BevyStore;

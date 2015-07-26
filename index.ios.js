/**
 * the bevy ios app
 * made by kevin for the SUB-OHM ARMY 
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StatusBarIOS,
  Navigator
} = React;

var MainView = require('./js/app/components/MainView.ios.js');

var Backbone = require('backbone');
var _ = require('underscore');

var Backbone = require('backbone');
Backbone.sync = function(method, model, options) {

  var headers = {
    'Accept': 'application/json'
  };
  var body = '';

  var url = model.url;
  if (!options.url) {
    url = _.result(model, 'url');
  } else {
    url = options.url;
  }

  if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(options.attrs || model.toJSON(options));
  }

  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'patch':  'PATCH',
    'delete': 'DELETE',
    'read':   'GET'
  };
  method = methodMap[method];

  return fetch(url, {
    method: method,
    headers: headers,
    body: body
  })
  .then(res => {
    var response = JSON.parse(res._bodyText);

    //console.log('model', model);
    //console.log('response', response);
    //console.log('options', options);

    options.success(response, options);
  });
}

var constants = require('./js/constants');
var routes = require('./js/routes');
var BEVY = constants.BEVY;
var POST = constants.POST;
var CHAT = constants.CHAT;
var NOTIFICATION = constants.NOTIFICATION;

var change_all_events = [
  POST.CHANGE_ALL,
  BEVY.CHANGE_ALL,
  NOTIFICATION.CHANGE_ALL,
  CHAT.CHANGE_ALL
].join(' ');

var BevyStore = require('./js/bevy/BevyStore');
var PostStore = require('./js/post/PostStore');
var ChatStore = require('./js/chat/ChatStore');
var FileStore = require('./js/File/FileStore');
var NotificationStore = require('./js/notification/NotificationStore');

var AppActions = require('./js/app/AppActions');

var bevyios = React.createClass({

  getInitialState() {

    StatusBarIOS.setStyle(1);
      
    return _.extend({},
      this.getBevyState(),
      this.getPostState(),
      this.getChatState(),
      this.getNotificationState()
    );
  },

  getBevyState() {
    return {
      myBevies: BevyStore.getMyBevies(),
      subBevies: BevyStore.getSubBevies(),
      activeBevy: BevyStore.getActive(),
      activeSuper: BevyStore.getActiveSuper(),
      activeSub: BevyStore.getActiveSub(),
      publicBevies: BevyStore.getPublicBevies()
    };
  },

  getPostState() {
    return {
      allPosts: PostStore.getAll()
    };
  },

  getChatState() {
    return {
      allThreads: ChatStore.getAll()
    };
  },

  getNotificationState() {
    return {
      allNotifications: NotificationStore.getAll()
    };
  },

  componentDidMount() {
    BevyStore.on(BEVY.CHANGE_ALL, this._onBevyChange);
    BevyStore.on(POST.CHANGE_ALL, this._onPostChange);
    BevyStore.on(CHAT.CHANGE_ALL, this._onChatChange);
    BevyStore.on(NOTIFICATION.CHANGE_ALL, this._onNotificationChange);

    PostStore.on(BEVY.CHANGE_ALL, this._onBevyChange);
    PostStore.on(POST.CHANGE_ALL, this._onPostChange);
    PostStore.on(CHAT.CHANGE_ALL, this._onChatChange);
    PostStore.on(NOTIFICATION.CHANGE_ALL, this._onNotificationChange);

    ChatStore.on(BEVY.CHANGE_ALL, this._onBevyChange);
    ChatStore.on(POST.CHANGE_ALL, this._onPostChange);
    ChatStore.on(CHAT.CHANGE_ALL, this._onChatChange);
    ChatStore.on(NOTIFICATION.CHANGE_ALL, this._onNotificationChange);

    NotificationStore.on(BEVY.CHANGE_ALL, this._onBevyChange);
    NotificationStore.on(POST.CHANGE_ALL, this._onPostChange);
    NotificationStore.on(CHAT.CHANGE_ALL, this._onChatChange);
    NotificationStore.on(NOTIFICATION.CHANGE_ALL, this._onNotificationChange);
  },

  componentWillUnmount() {
    BevyStore.off(change_all_events);
    PostStore.off(change_all_events);
    ChatStore.off(change_all_events);
    NotificationStore.off(change_all_events);

    AppActions.unload();
  },

  _onBevyChange() {
    this.setState(_.extend(this.state, this.getBevyState()));
  },
  _onPostChange() {
    this.setState(_.extend(this.state, this.getPostState()));
  },
  _onChatChange() {
    this.setState(_.extend(this.state, this.getChatState()));
  },
  _onNotificationChange() {
    this.setState(_.extend(this.state, this.getNotificationState()));
  },

  render() {

    var sceneConfig = Navigator.SceneConfigs.FloatFromBottom;
    // disable gestures
    sceneConfig.gestures = null;

    return (
        <Navigator
          configureScene={() => sceneConfig }
          initialRoute={ routes.MAIN.LOADING }
          initialRouteStack={ _.toArray(routes.MAIN) }
          renderScene={(route, navigator) => 
            <MainView 
              mainRoute={route}
              mainNavigator={navigator}
              { ...this.state }
            />
          }
        />
    );
  }
});

AppRegistry.registerComponent('bevyios', () => bevyios);


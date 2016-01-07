
/**
 * the bevy ios app
 * made by kevin for the SUB-OHM ARMY
 */
'use strict';

var React = require('react-native');
var {
  View,
  AppRegistry,
  StatusBarIOS,
  Navigator,
  AsyncStorage,
  PushNotificationIOS,
  AlertIOS
} = React;

var MainView = require('./js/app/components/ios/MainView.ios.js');
var LoginModal = require('./js/login/components/ios/LoginModal.ios.js');
var LoginNavigator = require('./js/login/components/ios/LoginNavigator.ios.js');
var NotificationActions = require('./js/notification/NotificationActions');
var NativeModules = require('NativeModules');

var Backbone = require('backbone');
var _ = require('underscore');

var $fetch = window.fetch;
window.fetch = function(input, init) {
  var url = input;
  var options = init;
  if(options == undefined) options = {};
  if(_.isEmpty(options.headers)) {
    options.headers = {
      'Accept': 'application/json'
    };
    if(!_.isEmpty(options.body)) {
      options.headers['Content-Type'] = 'application/json';
    }
  }
  // if this is an api call
  if(url.includes(constants.apiurl)) {
    // if we have an authorization token
    if(!_.isEmpty(UserStore.getAccessToken())) {
      //console.log(localStorage.getItem('access_token'));
      options.headers['Authorization'] = 'Bearer ' + UserStore.getAccessToken();
      //console.log(UserStore.getAccessToken(), url);
    }
  } else {
    // if this is going back to the main site
    // include the cookie it sent to maintain the session
    options.credentials = 'include';
  }
  return $fetch(url, options);
};

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

  //console.log(url, method);

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
};

var constants = require('./js/constants');
var routes = require('./js/routes');
var BEVY = constants.BEVY;
var POST = constants.POST;
var CHAT = constants.CHAT;
var NOTIFICATION = constants.NOTIFICATION;
var USER = constants.USER;
var BOARD = constants.BOARD;

var change_all_events = [
  POST.CHANGE_ALL,
  BEVY.CHANGE_ALL,
  NOTIFICATION.CHANGE_ALL,
  CHAT.CHANGE_ALL,
  BOARD.CHANGE_ALL
].join(' ');

var BevyStore = require('./js/bevy/BevyStore');
var PostStore = require('./js/post/PostStore');
var ChatStore = require('./js/chat/ChatStore');
var FileStore = require('./js/file/FileStore');
var NotificationStore = require('./js/notification/NotificationStore');
var UserStore = require('./js/user/UserStore');

var AppActions = require('./js/app/AppActions');

// load globals
var Backbone = require('backbone');
// backbone shim
Backbone.sync = function(method, model, options) {
  var headers = {
    'Accept': 'application/json'
  };
  var body = {};

  var url = model.url;
  if (!options.url) {
    url = _.result(model, 'url');
  } else {
    url = options.url;
  }

  if(options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
    headers['Content-Type'] = 'application/json';
    body = options.attrs || model.toJSON(options);
  }

  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'patch':  'PATCH',
    'delete': 'DELETE',
    'read':   'GET'
  };
  method = methodMap[method];

  var startTime = Date.now();
  //console.log('START ' + method + ' ' + url);

  var opts = {
    method: method,
    headers: headers,
    body: JSON.stringify(body)
  };
  if(method === 'GET' || method === 'HEAD')
    delete opts.body;

  return fetch(url, opts)
  .then(res => res.json())
  .then(res => {
    var endTime = Date.now();
    var deltaTime = endTime - startTime;
    //console.log('END', method, url);
    options.success(res, options);
  })
  .catch(error => {
    options.error(error.toString())
  });
};

var App = React.createClass({

  getInitialState() {

    StatusBarIOS.setStyle(1);

    return _.extend({
      authModalOpen: false,
      authModalMessage: '',
      registered: false,
    },
      this.getBevyState(),
      this.getPostState(),
      this.getChatState(),
      this.getNotificationState(),
      this.getUserState()
    );
  },

  getBevyState() {
    return {
      myBevies: BevyStore.getMyBevies(),
      activeBevy: BevyStore.getActive(),
      publicBevies: BevyStore.getPublicBevies(),
      bevyBoards: BevyStore.getBevyBoards(),
      activeBoard: BevyStore.getActiveBoard()
    };
  },

  getPostState() {
    return {
      allPosts: PostStore.getAll()
    };
  },

  getChatState() {
    //console.log(ChatStore.getAll());
    return {
      allThreads: ChatStore.getAll(),
      activeThread: ChatStore.getActive()
    };
  },

  getNotificationState() {
    return {
      allNotifications: NotificationStore.getAll()
    };
  },

  getUserState() {
    return {
      user: UserStore.getUser(),
      loggedIn: UserStore.loggedIn
    };
  },

  componentWillMount() {
    PushNotificationIOS.addEventListener('register', function(token) {
      console.log(this.state.registered);
      if(!this.state.registered && this.state.loggedIn) {
        console.log('trying');
        NotificationActions.registerDevice(token, this.state.user._id);
        this.setState({
          registered: true
        })
      }
    }.bind(this));

    PushNotificationIOS.addEventListener('notification', function(notification){
     console.log('You have received a new notification!');
    });



    BevyStore.on(BEVY.CHANGE_ALL, this._onBevyChange);
    BevyStore.on(BOARD.CHANGE_ALL, this._onBevyChange);
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

    UserStore.on(USER.LOADED, this._onUserChange);
  },

  componentWillUnmount() {
    BevyStore.off(change_all_events);
    PostStore.off(change_all_events);
    ChatStore.off(change_all_events);
    NotificationStore.off(change_all_events);

    PushNotificationIOS.removeEventListener('register', this._onNotificationReg);

    UserStore.off(USER.LOADED)

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
  _onUserChange() {
    console.log('user changed');
    this.setState(_.extend(this.state, this.getUserState()));
  },

  openAuthModal(message) {
    this.setState({
      authModalOpen: true,
      authModalMessage: (message == undefined) ? 'Please Log In To Continue' : message
    });
  },
  closeAuthModal() {
    console.log('closing');
    this.setState({
      authModalOpen: false
    });
  },
  toggleAuthModal() {
    this.setState({
      authModalOpen: !this.state.authModalOpen
    });
  },
  _onNotificationReg(data) {
    //console.log(data);
  },

  render() {

    var sceneConfig = Navigator.SceneConfigs.FloatFromBottom;
    // disable gestures
    sceneConfig.gestures = null;

    var authModalActions = {
      open: this.openAuthModal,
      close: this.closeAuthModal,
      toggle: this.toggleAuthModal
    };

    PushNotificationIOS.requestPermissions();/*
    //PushNotificationIOS.checkPermissions(data => {console.log(data)})

    NativeModules.CameraManager.checkDeviceAuthorizationStatus(function(err, isAuthorized) {
      if(isAuthorized) {
        //console.log('you have permissions');
      } else {
        //console.log('you dont');
      }
    });*/

    var initialRoute = routes.MAIN.LOADING;

    return (
      <View style={{ flex: 1 }}>
        <Navigator
          configureScene={() => sceneConfig }
          initialRoute={ initialRoute }
          initialRouteStack={[
            initialRoute
          ]}
          renderScene={(route, navigator) => {
              switch(route.name) {
                default:
                  return (
                    <MainView
                      mainRoute={ route }
                      mainNavigator={ navigator }
                      { ...this.state }
                    />
                  )
                  break;
              }
            }
          }
        />
      </View>
    );
  }
});


AppRegistry.registerComponent('bevyios', () => App);

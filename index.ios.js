
/**
 * the bevy ios app
 * made by kevin for the SUB-OHM ARM
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
  AlertIOS,
  StyleSheet,
  AppStateIOS
} = React;

var MainView = require('./js/app/components/ios/MainView.ios.js');
var LoginNavigator = require('./js/login/components/ios/LoginNavigator.ios.js');
var NotificationActions = require('./js/notification/NotificationActions');

var Backbone = require('backbone');
var _ = require('underscore');

var UserStore = require('./js/user/UserStore');
var PostStore = require('./js/post/PostStore');
var ChatStore = require('./js/chat/ChatStore');
var FileStore = require('./js/file/FileStore');
var NotificationStore = require('./js/notification/NotificationStore');
var BevyStore = require('./js/bevy/BevyStore');

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
  if(url.indexOf(constants.apiurl) > -1) {
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
  // set the network activity indicator to true
  StatusBarIOS.setNetworkActivityIndicatorVisible(true);

  var startTime = Date.now();
  //console.log('START', options.method, url);

  return $fetch(url, options)
    .then(res => {
      var endTime = Date.now();
      var delta = endTime - startTime;
      //console.log('END', options.method, url, delta + ' MS', res);

      // clear the network activity indicator
      StatusBarIOS.setNetworkActivityIndicatorVisible(false);
      return res;
    })
    .catch(err => {
      console.log('fetch shim err', err.toString());
      StatusBarIOS.setNetworkActivityIndicatorVisible(false);
      return err;
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
  BOARD.CHANGE_ALL,
  USER.CHANGE_ALL
].join(' ');

var Dispatcher = require('./js/shared/dispatcher');

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

  if(options.data == null && model &&
    (method === 'create' || method === 'update' || method === 'patch')) {
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

  var opts = {
    method: method,
    headers: headers,
    body: JSON.stringify(body)
  };
  if(method === 'GET' || method === 'HEAD' || method === 'OPTIONS')
    delete opts.body;


  return fetch(url, opts)
  .then(res => res.json())
  .then(res => {
    //console.log('fetch success');
    options.success(res, options);
  })
  .catch(error => {
    console.log(error.toString());
    options.error(error.toString());
  });
};

var App = React.createClass({

  getInitialState() {

    StatusBarIOS.setStyle(1);

    return _.extend({
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
      bevyBoards: BevyStore.getBevyBoards(),
      activeBoard: BevyStore.getActiveBoard(),
      bevyInvites: BevyStore.getBevyInvites()
    };
  },

  getPostState() {
    return {
      allPosts: PostStore.getAll()
    };
  },

  getChatState() {
    return {
      activeThread: ChatStore.getActive()
    };
  },

  getNotificationState() {
    return {
      allNotifications: NotificationStore.getAll(),
      unreadNotes: NotificationStore.getUnread()
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
    // make sure the users device is added to their user object, so they may receive notifications
    PushNotificationIOS.requestPermissions();

    // the notification user used to open bevy, if they opened with a notification
    var launchNotification = PushNotificationIOS.popInitialNotification();

    if (launchNotification) {
      this.appOpenedByNotificationTap(launchNotification);
    }

    PushNotificationIOS.addEventListener('notification', function (notification) {
      if (AppStateIOS.currentState === 'background') {
        this.backgroundNotification = notification;
      }
    }.bind(this));

    AppStateIOS.addEventListener('change', function (new_state) {
      if (new_state === 'active' && this.backgroundNotification != null) {
        this.appOpenedByNotificationTap(this.backgroundNotification);
        this.backgroundNotification = null;
      }
    }.bind(this));

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
    this.setState(_.extend(this.state, this.getUserState()));
  },

  _onNotificationReg(data) {
    //console.log(data);
  },

  appOpenedByNotificationTap(notification) {
    NotificationActions.setInitialNote(notification);
  },

  render() {
    var sceneConfig = Navigator.SceneConfigs.FloatFromBottom;
    // disable gestures
    sceneConfig.gestures = null;

    return (
      <View style={ styles.container }>
        <Navigator
          configureScene={() => sceneConfig }
          initialRouteStack={[{
            name: routes.MAIN.LOADING
          }]}
          renderScene={(route, navigator) => {
            return (
              <MainView
                mainRoute={ route }
                mainNavigator={ navigator }
                clearNoteData={() => this.setState({ initalNotification: {} })}
                { ...this.state }
              />
            );
          }}
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

AppRegistry.registerComponent('bevyios', () => App);

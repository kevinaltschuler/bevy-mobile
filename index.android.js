/**
 * entry point of android app
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  AsyncStorage,
  Text,
  View,
  Navigator,
  BackAndroid
} = React;
var MainView = require('./js/app/components/android/MainView.android.js');
var ImageModal = require('./js/post/components/android/ImageModal.android.js');
var Fletcher = require('./js/shared/components/android/Fletcher.android.js');
var ActionSheet = require('./js/shared/components/android/ActionSheet.android.js');
var TagModal = require('./js/bevy/components/android/TagModal.android.js');

var routes = require('./js/routes');
var constants = require('./js/constants');
var BEVY = constants.BEVY;
var POST = constants.POST;
var CHAT = constants.CHAT;
var NOTIFICATION = constants.NOTIFICATION;
var USER = constants.USER;
var Backbone = require('backbone');
var _ = require('underscore');


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
    headers['Content-Encoding'] = 'gzip';
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
  console.log('START ' + method + ' ' + url);

  Fletcher.fletch(url, {
    method: method,
    headers: headers,
    body: JSON.stringify(body)
  }, function(error) {
    console.error(error);
  }, function(response) {
    var endTime = Date.now();
    var deltaTime = endTime - startTime;
    console.log('END ' + deltaTime + 'ms ' + method + ' ' + url);
    response = JSON.parse(response);
    options.success(response, options);
  });

  /*return fetch(url, {
    method: method,
    headers: headers,
    body: body
  })
  .then((res) => {
    var endTime = Date.now();
    var deltaTime = endTime - startTime;
    console.log('END', method, url);
    var response = JSON.parse(res._bodyText);
    options.success(response, options);
  })
  .catch((error) => {
    console.error(error);
  })
  .done();*/
};



var BevyStore = require('./js/bevy/BevyStore');
var PostStore = require('./js/post/PostStore');
var ChatStore = require('./js/chat/ChatStore');
var FileStore = require('./js/file/FileStore');
var NotificationStore = require('./js/notification/NotificationStore');
var UserStore = require('./js/user/UserStore');

var AppActions = require('./js/app/AppActions');

var change_all_events = [
  POST.CHANGE_ALL,
  BEVY.CHANGE_ALL,
  NOTIFICATION.CHANGE_ALL,
  CHAT.CHANGE_ALL
].join(' ');

var App = React.createClass({

  getInitialState() {
    return _.extend({
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
      frontpageFilters: BevyStore.getFrontpageFilters(),
      activeTags: BevyStore.getActiveTags()
    };
  },

  getPostState() {
    return {
      allPosts: PostStore.getAll()
    };
  },

  getChatState() {
    return {
      allThreads: ChatStore.getAll(),
      activeThread: ChatStore.getActive()
    };
  },

  getNotificationState() {
    return {
      allNotifications: NotificationStore.getAll(),
      unreadCount: NotificationStore.getUnread()
    };
  },

  getUserState() {
    return {
      user: UserStore.getUser(),
      loggedIn: UserStore.loggedIn,
      linkedAccounts: UserStore.getLinkedAccounts()
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

    UserStore.on(USER.LOADED, this._onUserChange);

    // first things first try to load the user
    console.log('loading...');
    AsyncStorage.getItem('user')
    .then((user) => {
      if(user) {
        console.log('user fetched');
        UserStore.setUser(JSON.parse(user));
        AppActions.load();
      } else {
        console.log('going to login screen...');
        AppActions.load();
      }
    });
  },

  componentWillUnmount() {
    BevyStore.off(change_all_events);
    PostStore.off(change_all_events);
    ChatStore.off(change_all_events);
    NotificationStore.off(change_all_events);
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
    this.setState(_.extend(this.state, this.getUserState()));
  },

  render: function() {
    return (
      <View style={styles.container}>
        <Navigator
          initialRouteStack={[
            routes.MAIN.TABBAR
          ]}
          sceneStyle={{
            flex: 1
          }}
          renderScene={(route, navigator) => 
            <MainView 
              mainRoute={ route }
              mainNavigator={ navigator }
              { ...this.state }
            />
          }
        />
        <ImageModal />
        <ActionSheet />
        <TagModal activeTags={ this.state.activeTags }/>
      </View>
    );
  }
});

BackAndroid.addEventListener('hardwareBackPress', function() {
  console.log('BACK BUTTON PRESSED FAM');
  return true;
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('bevyios', () => App);

/**
 * constants.js
 *
 * list of constants to use when dispatching and receiving events
 * also sets some nifty environment variables
 *
 * @author albert
 */

'use strict';

var user = {};
var searchNavigator = {};
var mainTabBar = {};
var slashes = '//';

var api_subdomain = 'api';
var api_version = '';
var hostname = 'joinbevy.com';
var protocol = 'http:';

exports.android_version = '1.0.6';
exports.android_phase = 'ALPHA';

exports.ios_version = '1.3.0';

//exports.siteurl = protocol + slashes + hostname;
//exports.apiurl = protocol + slashes + api_subdomain + '.' + api_version + hostname;
exports.siteurl = 'http://joinbevy.com';
exports.apiurl = 'http://api.joinbevy.com';
//exports.siteurl = 'http://bevy.dev';
//exports.apiurl = 'http://api.bevy.dev';


exports.hostname = hostname;
exports.protocol = protocol;
exports.api_subdomain = api_subdomain;
exports.api_version = api_version;

exports.client_id = 'ios';
exports.client_secret = 'BY-THE-LIGHT-OF-THE-MOON';
exports.google_client_id = '540892787949-0e61br4320fg4l2its3gr9csssrn07aj.apps.googleusercontent.com';
exports.google_client_secret = 'LuNykxTlzbeH8pa6f77WXroG';
exports.google_redirect_uri = 'com.joinbevy.ios:/oauth2callback';
//exports.google_redirect_uri = 'com.googleusercontent.apps.540892787949-0e61br4320fg4l2its3gr9csssrn07aj:/oauth2callback';

var window = require('Dimensions').get('window');
exports.width = window.width
exports.height = window.height

exports.sideMenuWidth = ((window.width * (4/5)) >= 300) ? 300 : (window.width * (4/5));

var React = require('react-native');
var {
  Platform,
  StatusBarIOS,
  NativeModules
} = React;
if(Platform.OS == 'ios') {
  this.height = 20;
  var RCTStatusBarManager = NativeModules.StatusBarManager;
  RCTStatusBarManager.getHeight(res => {
    this.height = res.height;
  });
  //console.log(this.height);
  exports.getStatusBarHeight = function() {
    return height;
  };
}

exports.APP = {
  LOAD: 'app_load',
  UNLOAD: 'app_unload',
  SWITCH_SEARCH_TYPE: 'app_switch_search_type',

  CHANGE_ALL: 'app_change_all'
};

exports.POST = {
  CREATE: 'post_create',
  DESTROY: 'post_destroy',
  VOTE: 'post_vote',
  SORT: 'post_sort',
  UPDATE_LIST: 'post_update_list',
  POST_CREATED: 'post_created',
  REFRESH: 'post_refresh',
  UPDATE: 'post_update',

  FETCH: 'post_fetch',
  FETCH_BOARD: 'post_fetch_board',

  LOADING: 'post_loading',
  LOADED: 'post_loaded',
  CHANGE_ALL: 'post_change_all',
  CHANGE_ONE: 'post_change_one:'
};

exports.COMMENT = {
  CREATE: 'comment_create',
  EDIT: 'comment_edit',
  DESTROY: 'comment_destroy',
  VOTE: 'comment_vote'
}

exports.BEVY = {
  CREATE: 'bevy_create',
  DESTROY: 'bevy_destroy',
  UPDATE: 'bevy_update',
  SET_NOTIFICATION_LEVEL: 'bevy_set_notification_level',
  LEAVE: 'bevy_leave',
  SWITCH: 'bevy_switch',
  INVITE: 'bevy_invite',
  ADD_USER: 'bevy_add_user',
  SEARCH: 'bevy_search',
  SUBSCRIBE: 'bevy_subscribe',
  UNSUBSCRIBE: 'bevy_unsubscribe',
  UPDATE_FRONT: 'bevy_updatefront',
  UPDATE_TAGS: 'bevy_updatetags',
  REQUEST_JOIN: 'bevy_request_join',
  ADD_TAG: 'bevy_add_tag',
  REMOVE_TAG: 'bevy_remove_tag',
  ADD_ADMIN: 'bevy_add_admin',
  REMOVE_ADMIN: 'bevy_remove_admin',
  ADD_RELATED: 'bevy_add_related',
  REMOVE_RELATED: 'bevy_remove_related',
  JOIN: 'bevy_join',

  FETCH: 'bevy_fetch',
  FETCH_PUBLIC: 'bevy_fetch_public',

  LOADING: 'bevy_loading',
  LOADED: 'bevy_loaded',

  SEARCHING: 'bevy_searching',
  SEARCH_COMPLETE: 'bevy_search_complete',
  SEARCH_ERROR: 'bevy_search_error',
  CHANGE_ALL: 'bevy_change_all',
  CHANGE_ONE: 'bevy_change_one',
  SWITCHED: 'bevy_switched',
  CREATED: 'bevy_created',
  NAV_POSTVIEW: 'bevy_nav_postview'
};

exports.BOARD = {
  SWITCH: 'board_switch',
  CLEAR: 'board_clear',
  DESTROY: 'board_destroy',
  LEAVE: 'board_leave',
  JOIN: 'board_join',
  UPDATE: 'board_update',
  CREATE: 'board_create',
  CREATED: 'board_created'
};

exports.CHAT = {
  // actions
  SWITCH: 'chat_switch',
  THREAD_OPEN: 'chat_thread_open',
  FETCH_MORE: 'chat_fetch_more',
  POST_MESSAGE: 'chat_post_message',
  CREATE_THREAD_AND_MESSAGE: 'chat_create_thread_and_message',
  ADD_USERS: 'chat_add_users',
  REMOVE_USER: 'chat_remove_user',
  DELETE_THREAD: 'chat_delete_thread',
  EDIT_THREAD: 'chat_edit_thread',
  START_PM: 'chat_start_pm',
  FETCH_THREADS: 'chat_fetch_threads',
  DELETE_MESSAGE: 'chat_delete_message',

  // events
  FETCHING_THREADS: 'chat_fetching_threads',
  THREADS_FETCHED: 'chat_threads_fetched',
  CHANGE_ALL: 'chat_change_all',
  CHANGE_ONE: 'chat_change_one:',
  FETCHING_MESSAGES: 'chat_fetching_messages',
  MESSAGES_FETCHED: 'chat_messages_fetched',
  THREAD_CREATED: 'chat_thread_created',
  SWITCH_TO_THREAD: 'chat_switch_to_thread',
  SWITCH_TO_THREAD_INTENT: 'chat_switch_to_thread_intent',
  STARTED_PM: 'chat_started_pm'
};

exports.USER = {
  LOAD_USER: 'user_load_user',
  UPDATE: 'user_update',
  LOGIN: 'user_login',
  LOGIN_GOOGLE: 'user_login_google',
  LOGOUT: 'user_logout',
  CHANGE_PROFILE_PICTURE: 'user_change_profile_picture',
  SWITCH_USER: 'user_switch_user',
  LINK_ACCOUNT: 'user_link_account',
  UNLINK_ACCOUNT: 'user_unlink_account',
  REGISTER: 'user_register',
  RESET_PASSWORD: 'user_reset_password',
  VERIFY_USERNAME: 'user_verify_username',

  LOGIN_ERROR: 'user_login_error',
  LOGIN_SUCCESS: 'user_login_success',
  RESET_PASSWORD_SUCCESS: 'user_reset_password_success',
  RESET_PASSWORD_ERROR: 'user_reset_password_error',
  VERIFY_SUCCESS: 'user_verify_success',
  VERIFY_ERROR: 'user_verify_error',
  CHANGE_ALL: 'user_change_all',
  LOADED: 'user_loaded',
  TOKENS_LOADED: 'user_tokens_loaded',

  SEARCH: 'user_search',
  SEARCHING: 'user_searching',
  SEARCH_COMPLETE: 'user_search_complete',
  SEARCH_ERROR: 'user_search_error'
};

exports.FILE = {
  'UPLOAD': 'file_upload',

  'UPLOAD_COMPLETE': 'file_upload_complete',
  'UPLOAD_ERROR': 'file_upload_error'
}

exports.NOTIFICATION = {
  // actions
  DISMISS: 'notification_dismiss',
  DISMISS_ALL: 'notification_dismiss_all',
  REGISTER: 'notification_register',
  FETCH: 'notification_fetch',

  // events
  CHANGE_ALL: 'notification_change_all',
  FETCHING: 'notification_fetching',
  FETCHED: 'notification_fetched'
};

exports.INVITE = {
  INVITE_USER: 'invite_invite_user',
  DESTROY: 'invite_destroy',
  ACCEPT_REQUEST: 'invite_accept_request',
  REJECT_INVITE: 'invite_reject_invite'
};

exports.setSearchNavigator = function(navigator) {
	searchNavigator = navigator;
};

exports.getSearchNavigator = function() {
	return searchNavigator;
};

exports.setMainTabBar = function(theBar) {
  mainTabBar = theBar;
};

exports.getMainTabBar = function() {
  return mainTabBar;
}

// ANDROID STUFF
// DONT TOUCH THIS KEVIN OR ELSE

var imageModalActions = {}
var imageModalImages = [];
exports.setImageModalActions = function(actions) {
  imageModalActions = actions;
};
exports.getImageModalActions = function() {
  return imageModalActions;
};
exports.setImageModalImages = function(images) {
  imageModalImages = images;
};
exports.getImageModalImages = function() {
  return imageModalImages
};

var tagModalActions = {};
exports.setTagModalActions = function(actions) {
  tagModalActions = actions;
};
exports.getTagModalActions = function() {
  return tagModalActions;
};

var tabBarActions = {};
exports.setTabBarActions = function(actions) {
  tabBarActions = actions;
};
exports.getTabBarActions = function() {
  return tabBarActions;
};

var searchBarActions = {};
exports.setSearchBarActions = function(actions) {
  searchBarActions = actions;
};
exports.getSearchBarActions = function() {
  return searchBarActions;
};

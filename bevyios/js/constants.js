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
var slashes = '//';

var api_subdomain = 'api';
var api_version = '';
var hostname = 'joinbevy.com';
var protocol = 'http:';

exports.siteurl = protocol + slashes + hostname;
exports.apiurl = protocol + slashes + api_subdomain + '.' + api_version + hostname;

exports.hostname = hostname;
exports.protocol = protocol;
exports.api_subdomain = api_subdomain;
exports.api_version = api_version;

exports.google_client_id = '540892787949-0e61br4320fg4l2its3gr9csssrn07aj.apps.googleusercontent.com';
exports.google_client_secret = 'LuNykxTlzbeH8pa6f77WXroG';
exports.google_redirect_uri = 'com.joinbevy.ios:/oauth2callback';
//exports.google_redirect_uri = 'com.googleusercontent.apps.540892787949-0e61br4320fg4l2its3gr9csssrn07aj:/oauth2callback';

exports.APP = {
	LOAD: 'app_load'
};

exports.POST = {
	CREATE: 'post_create',
	DESTROY: 'post_destroy',
	UPVOTE: 'post_upvote',
	DOWNVOTE: 'post_downvote',
	SORT: 'post_sort',

	FETCH: 'post_fetch',

	CHANGE_ALL: 'post_change_all',
	CHANGE_ONE: 'post_change_one'
};

exports.COMMENT = {
	CREATE: 'comment_create',
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

	FETCH: 'bevy_fetch',

	CHANGE_ALL: 'bevy_change_all',
	CHANGE_ONE: 'bevy_change_one'
};

exports.user = {
	CREATE: 'user_create',
	DESTROY: 'user_destroy',
	UPDATE: 'user_update',
	SWITCH: 'user_switch',

	CHANGE_ALL: 'user_change_all'
};

exports.NOTIFICATION = {
	  DISMISS: 'notification_dismiss',

	  CHANGE_ALL: 'notification_change_all'
};

exports.setUser = function(tempUser) {
	user = tempUser;
};

exports.getUser = function() {
	return user;
};

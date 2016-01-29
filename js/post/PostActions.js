/**
 * PostActions.js
 *
 * the glue between the front end React components
 * and the back end Backbone models
 *
 * @author albert
 * @flow
 */

'use strict';

var Dispatcher = require('./../shared/dispatcher');
var _ = require('underscore');
var constants = require('./../constants');
var POST = constants.POST;

var _ = require('underscore');

var PostActions = {
	/**
	 * fetch posts from either a bevy or the posts that a certain user has posted
	 * @param {string} bevy_id - id of the bevy to fetch from
	 * @param {string} user_id - id of the user to fetch from (bevy_id must be null)
	 */
	fetch(bevy_id: String, user_id: String) {
		// must fetch from a bevy or a user
		if(_.isEmpty(bevy_id) && _.isEmpty(user_id)) return;

		Dispatcher.dispatch({
			actionType: POST.FETCH,
			bevy_id: (bevy_id == undefined) ? null : bevy_id,
			user_id: (user_id == undefined) ? null: user_id
		});
	},

	/**
	 * fetch posts from a board
	 * @param {string} board_id - id of the board to fetch posts from
	 */
	fetchBoard(board_id: String) {
		// must identify board to fetch from
		if(_.isEmpty(board_id)) return;

		Dispatcher.dispatch({
			actionType: POST.FETCH_BOARD,
			board_id: board_id
		});
	},

	/**
	 * fetch and sync a single post with the server
	 * @param {string} post_id - id of the post to sync
	 */
	fetchSingle(post_id: String) {
		// must identify post to fetch
		if(_.isEmpty(post_id)) return;

		Dispatcher.dispatch({
			actionType: POST.FETCH_SINGLE,
			post_id: post_id
		});
	},

	/**
	 * search for posts
	 * @param {string} query - search query to match on the server. if empty will just
	 * fetch some random posts based on the bevy/board restrictions
	 * @param {string} bevy_id - restrict post search to a certain bevy's boards
	 * @param {string} board_id - restrict post search to a certain board. if this is not null,
	 * then the bevy_id parameter is ignored
	 */
	search(query: String, bevy_id: String, board_id: String) {
		Dispatcher.dispatch({
			actionType: POST.SEARCH,
			query: (query == undefined) ? null : query,
			bevy_id: (bevy_id == undefined) ? null : bevy_id,
			board_id: (board_id == undefined) ? null : board_id
		});
	},

	/**
	 * create a post
	 * @param {string} title - the post body text
	 * @param {array} images - array of image objects bundled with this post
	 * @param {object} author - user object of the post author (almost always the signed in user)
	 * @param {object} board - board object of the board this post is being posted to
	 * @param {string} type - the post type of this new post
	 * @param {object} event - stores event data for an event post type
	 */
	create(title: String, images: Array, author: Object, board: Object, type: String, event: Object) {
		// dont allow posts with no author
		if(_.isEmpty(author)) return;
		// dont allow posts without a board
		if(_.isEmpty(board)) return;

		Dispatcher.dispatch({
		  actionType: POST.CREATE,
		  title: (title == undefined) ? 'untitled' : title,
		  images: (images == undefined) ? [] : images,
		  author: (author == undefined) ? null : author,
		  board: (board == undefined) ? null : board,
		  type: (type == undefined) ? 'default' : type,
		  event: (event == undefined) ? null : event,
		});
	},

	/**
	 * destroys the given post on the server, and removes it locally
	 * @param {string} post_id - id of the post to delete
	 */
	destroy(post_id: String) {
		// must identify post to delete
		if(_.isEmpty(post_id)) return;

		Dispatcher.dispatch({
			actionType: POST.DESTROY,
			post_id: post_id
		});
	},

	/**
	 * update a post on the server with the given changes
	 * @param {string} post_id - id of the post to update
	 * @param {string} title - the post body text
	 * @param {array} images - array of images to bundle with the post
	 * @param {object} event - event data for an event type post
	 */
	update(post_id: String, title: String, images: Array, event: Object) {
		// must identify a post to update
		if(_.isEmpty(post_id)) return;

		Dispatcher.dispatch({
			actionType: POST.UPDATE,
			post_id: post_id,
			title: (title == undefined) ? null : title,
			images: (images == undefined) ? null : images,
			event: (event == undefined) ? null : event
		});
	},

	/**
	 * like or unlike a post
	 * @param {string} post_id - post to vote on
	 */
	vote(post_id: String) {
		// must identify a post to vote on
		if(_.isEmpty(post_id)) return;

		Dispatcher.dispatch({
			actionType: POST.VOTE,
			post_id: post_id
		});
	},

	/**
	 * sort the list of posts
	 * @param {string} by the sorting method ('top', 'new')
	 * @param {string} direction either 'asc' or 'desc'
	 */
	sort(by: String, direction: String) {
		Dispatcher.dispatch({
			actionType: POST.SORT,
			by: (by == undefined) ? 'new' : by,
			direction: (direction == undefined) ? 'asc' : direction
		});
	},

	/**
	 * pin a post, so it appears at the top of every list
	 * @param {string} post_id - id of the post to pin
	 */
	pin(post_id: String) {
		// must identify the post to pin
		if(_.isEmpty(post_id)) return;

		Dispatcher.dispatch({
			actionType: POST.PIN,
			post_id: post_id
		});
	},

	setTempPost(post: Object) {
		// dont allow an empty temp post. use clearTempPost instead
		if(_.isEmpty(post)) return;

		Dispatcher.dispatch({
			actionType: POST.SET_TEMP_POST,
			post: post
		});
	},

	clearTempPost() {
		Dispatcher.dispatch({
			actionType: POST.CLEAR_TEMP_POST
		});
	}
};

module.exports = PostActions;

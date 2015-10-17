/**
 * PostActions.js
 *
 * the glue between the front end React components
 * and the back end Backbone models
 *
 * uses the helper dispatch function for clarity of
 * event name
 *
 * @author albert
 */

'use strict';

// imports
var dispatch = require('./../shared/helpers/dispatch');

var POST = require('./../constants').POST;


var PostActions = {

	fetch(bevy, user_id) {
		dispatch(POST.FETCH, {
			bevy: (bevy == undefined) ? null : bevy,
			user_id: (user_id == undefined) ? null: user_id
		});
	},


	/**
	* create a post
	* @param  {string} title
	* @param  {string} image_url
	* @param  {string} author
	* @param  {string} bevy
	*/
	create(title, images, author, bevy, type, event, tag) {
		dispatch(POST.CREATE, {
		  title: (title == undefined) ? 'untitled' : title,
		  images: (images == undefined) ? null : images,
		  author: (author == undefined) ? null : author, // grab the current, logged in user?
		  bevy: (bevy == undefined) ? null : bevy, // grab the current, active bevy
		  type: (type == undefined) ? 'default' : type,
		  event: (event == undefined) ? null : event,
		  tag: (tag == undefined) ? null: tag
		});
	},

	destroy(post_id) {
		dispatch(POST.DESTROY, {
			post_id: (post_id == undefined) ? '0' : post_id
		});
	},

	update(post_id, postTitle) {
		dispatch(POST.UPDATE, {
			post_id: (post_id == undefined) ? '0' : post_id,
			postTitle: (postTitle == undefined) ? '' : postTitle
		});
	},

	vote(post_id) {
		dispatch(POST.VOTE, {
			post_id: (post_id == undefined) ? '' : post_id
		});
	},

	/**
	 * sort the list of posts
	 * @param  {string} by        the sorting method ('top', 'new')
	 * @param  {string} direction either 'asc' or 'desc'
	 */
	sort(by, direction) {
		dispatch(POST.SORT, {
			by: (by == undefined) ? 'new' : by,
			direction: (direction == undefined) ? 'asc' : direction
		});
	},

	pin(post_id) {
		dispatch(POST.PIN, {
			post_id: (post_id == undefined) ? '' : post_id
		});
	},

	mute(post_id) {
		dispatch(POST.MUTE, {
			post_id: (post_id == undefined) ? '' : post_id
		});
	},

	cancel() {
		dispatch(POST.CANCEL, {});
	}
};

module.exports = PostActions;

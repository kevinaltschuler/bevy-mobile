/**
 * BoardActions.js
 *
 * Action dispatcher for boards
 *
 * @author kevin
 */

'use strict';

// imports
var _ = require('underscore')
var Dispatcher = require('./../shared/dispatcher');
var BEVY = require('./../constants').BEVY;
var BOARD = require('./../constants').BOARD;
var getSlug = require('speakingurl');

var BoardActions = {
  loadBoardView(board_id) {
    if(_.isEmpty(board_id)) return;

    Dispatcher.dispatch({
      actionType: BOARD.LOADBOARDVIEW,
      board_id: board_id
    });
  },

  create(name, description, image, parent_id, type) {
    if(_.isEmpty(name)) return;
    if(_.isEmpty(parent_id)) return;
    if(_.isEmpty(type)) {
      type = 'discussion';
    }
    if(_.isEmpty(image)) {
      image = {
        filename: constants.siteurl + '/img/default_board_img.png',
        foreign: true
      };
    }

    Dispatcher.dispatch({
      actionType: BOARD.CREATE,
      name: name,
      description: (description == undefined) ? '' : description,
      image: image,
      parent_id: parent_id,
      type: type
    });
  },

  destroy(board_id) {
    if(_.isEmpty(board_id)) return;

    Dispatcher.dispatch({
      actionType: BOARD.DESTROY,
      board_id: board_id
    });
  },

  update(board_id, name, description, image, settings) {
    if(_.isEmpty(board_id)) return;

    Dispatcher.dispatch({
      actionType: BOARD.UPDATE,
      board_id: board_id,
      name: (name == undefined) ? null : name,
      description: (description == undefined) ? null : description,
      image: (image == undefined) ? null : image,
      settings: (settings == undefined) ? null : settings
    });
  },

  leave(board_id) {
    if(_.isEmpty(board_id)) return;

    Dispatcher.dispatch({
      actionType: BOARD.LEAVE,
      board_id: board_id
    });
  },

  join(board_id) {
    if(_.isEmpty(board_id)) return;

    Dispatcher.dispatch({
      actionType: BOARD.JOIN,
      board_id: board_id,
    });
  },

  switchBoard(board_id) {
    console.log(board_id);
    if(_.isEmpty(board_id)) return;
    Dispatcher.dispatch({
      actionType: BOARD.SWITCH_BOARD,
      board_id: board_id
    });
  },

  clearBoard() {
    Dispatcher.dispatch({
      actionType: BOARD.CLEAR,
    });
  }
};

module.exports = BoardActions;

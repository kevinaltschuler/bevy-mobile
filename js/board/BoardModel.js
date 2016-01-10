/**
 * BoardModel.js
 * @author albert
 * @author kevin
 * @flow
 */

'use strict';

var Backbone = require('backbone');

var BoardModel = Backbone.Model.extend({
  idAttribute: '_id'
});

module.exports = BoardModel;

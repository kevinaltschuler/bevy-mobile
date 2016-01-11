/**
 * PostBody.ios.js
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Image,
  StyleSheet
} = React;

var _ = require('underscore');
var constants = require('./../../../constants');

var PostBody = React.createClass({
  propTypes: {
    post: React.PropTypes.object
  },

  render() {
    return (
      <View />
    );
  }
});

var styles = StyleSheet.create({
  container: {

  }
});

module.exports = PostBody;

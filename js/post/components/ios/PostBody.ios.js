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
      <View style={ styles.body }>
        <Text style={ styles.bodyText }>
          { this.props.post.title }
        </Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 15,
    paddingLeft: 15,
    paddingRight: 15
  },
  bodyText: {
    fontSize: 17,
    color: '#666'
  },
});

module.exports = PostBody;

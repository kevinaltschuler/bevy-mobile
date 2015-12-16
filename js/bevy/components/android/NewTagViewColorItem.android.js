/**
 * NewTagViewColorItem.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TouchableNativeFeedback,
  StyleSheet
} = React;

var _ = require('underscore');

var NewTagViewColorItem = React.createClass({
  propTypes: {
    color: React.PropTypes.string,
    onSelect: React.PropTypes.func
  },

  select() {
    this.props.onSelect(this.props.color);
  },

  render() {
    return (
      <TouchableNativeFeedback
        onPress={ this.select }
      >
        <View style={[styles.button, {
          backgroundColor: this.props.color
        }]} />
      </TouchableNativeFeedback>
    );
  }
});

var styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginLeft: 10
  }
});

module.exports = NewTagViewColorItem;

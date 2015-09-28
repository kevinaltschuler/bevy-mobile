/**
 * BevyListItem.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet
} = React;

var BevyListItem = React.createClass({
  propTypes: {
    bevy: React.PropTypes.object
  },

  render() {
    return (
      <View style={ styles.container }>
        <Text>{ this.props.bevy.name }</Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {

  }
});

module.exports = BevyListItem;
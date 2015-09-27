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
  render() {
    return (
      <View style={ styles.container }>
        <Text>Bevy List Item</Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {

  }
});

module.exports = BevyListItem;
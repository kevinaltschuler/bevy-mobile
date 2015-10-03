/**
 * SearchView.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet
} = React;

var SearchView = React.createClass({
  render() {
    return (
      <View style={ styles.container }>
      	<Text>Search View</Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48
  }
});

module.exports = SearchView;
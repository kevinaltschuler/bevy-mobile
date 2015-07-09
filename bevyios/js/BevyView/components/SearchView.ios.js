'use strict';

var React = require('react-native');

var {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image
} = React;

var SearchView = React.createClass({
  render() {
    return (
      <View style={styles.container}>
        <Text>Search page</Text>
      </View>
    )
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  }
});

module.exports = SearchView;
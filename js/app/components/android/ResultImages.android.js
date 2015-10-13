/**
 * SearchResult.android.js
 * @author Ben
 */
'use strict';

var React = require('react-native');
var {
  View,  
  Text,
  StyleSheet,
  TouchableHighlight,
  Image
} = React;

var Result = React.createClass({
	render() {
		return(
			<view styles={syles.container}>

			</view>
		);
	}

});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#FFF',
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 3
  }
});

module.exports = Result;
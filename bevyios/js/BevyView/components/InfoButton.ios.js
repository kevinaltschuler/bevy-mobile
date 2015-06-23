/*InfoButton.ios.js
* made by @altschulerkevin
*/
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Text,
  View,
  NavigatorIOS,
  TouchableHighlight,
  Image,
  TextInput
} = React;

var Icon = require('FAKIconImage');
var SearchPage = require('./SearchPage.ios.js');

var SearchBar = React.createClass({
  render() {
    return (
      <TextInput style={styles.input} placeholder="Search Bevy" />
    )
  }
});

var InfoButton = React.createClass({

  onPress: function() {
    this.props.goToInfo();
  },

  render: function() {
  return (
      <TouchableHighlight
        underlayColor={'rgba(0,0,0,0)'}
        onPress={this.onPress}
      >
        <Icon
          name='ion|ios-information-outline'
          size={30}
          color='white'
          style={styles.bevyListButton}
        />
    </TouchableHighlight>
    );
  },

});

var styles = StyleSheet.create({
  bevyListButton: {
    paddingLeft: 45,
    width: 30,
    height: 30
  },
  input: {
    backgroundColor: 'rgba(0,0,0,.2)',
    width: 220,
    height: 32,
    marginTop: 6,
    paddingLeft: 10,
    color: 'white',
    borderRadius: 4
  }

});


module.exports = InfoButton;
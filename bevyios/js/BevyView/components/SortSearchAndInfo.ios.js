'use strict';

var React = require('react-native');

var SearchButton = require('./SearchButton.ios.js');
var InfoButton = require('./InfoButton.ios.js');

var SearchPage = require('./SearchPage.ios.js');


var {
  StyleSheet,
  View,
  TextInput
} = React;

var SearchBar = React.createClass({
  render() {
    return (
      <TextInput style={styles.input} placeholder="Search Bevy" />
    )
  }
});


var SearchAndCompose = React.createClass({

  goToSearch: function() {
    this.props.toRoute({
      name: "Search",
      component: SearchPage,
      titleComponent: SearchBar,
      rightCorner: InfoButton
    })
  },

  render: function() {
    return (
      <View style={styles.iconContainer}>
        <SearchButton goToSearch={this.goToSearch} />
        <InfoButton />
      </View>
    )
  }
});

var styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    width: 21,
    height: 21,
    marginTop: 4,
    marginRight: 15
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


module.exports = SearchAndCompose;
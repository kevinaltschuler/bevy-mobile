/*SearchButton.ios.js
* made by @altschulerkevin
*/
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  TouchableHighlight
} = React;

var {
  Icon
} = require('react-native-icons');

var SearchButton = React.createClass({
  propTypes: {
    onPress: React.PropTypes.func
  },

  onPress: function() {
    this.props.onPress();
  },

  render: function() {
    return (
      <TouchableHighlight
        underlayColor={'rgba(0,0,0,0)'}
        onPress={this.onPress}
      >
        <Icon
          name='ion|ios-search'
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

module.exports = SearchButton;

/*InfoButton.ios.js
* made by @altschulerkevin
*/
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  TouchableHighlight
} = React;

var Icon = require('react-native-vector-icons/Ionicons');

var InfoButton = React.createClass({

  propTypes: {
    onPress: React.PropTypes.func,
    color: React.PropTypes.string
  },

  onPress: function() {
    this.props.onPress();
  },

  render: function() {
    return (
      <TouchableHighlight
        underlayColor={'rgba(0,0,0,0.1)'}
        style={styles.highlight}
        onPress={this.onPress}
      >
        <Icon
          name='ios-information'
          size={25}
          color={this.props.color}
          style={styles.bevyListButton}
        />
      </TouchableHighlight>
    );
  },
});

var styles = StyleSheet.create({
  bevyListButton: {
    width: 25,
    height: 25,
  },
  highlight: {
    marginRight: 10,
    borderRadius: 17,
    width: 35,
    height: 35,
    paddingTop: 5,
    paddingLeft: 8
  }
});

module.exports = InfoButton;
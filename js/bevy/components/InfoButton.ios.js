/*InfoButton.ios.js
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

var InfoButton = React.createClass({

  propTypes: {
    onPress: React.PropTypes.func
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
          name='ion|ios-information-empty'
          size={35}
          color='#666'
          style={styles.bevyListButton}
        />
      </TouchableHighlight>
    );
  },
});

var styles = StyleSheet.create({
  bevyListButton: {
    width: 35,
    height: 35,
  },
  highlight: {
    borderRadius: 17
  }
});

module.exports = InfoButton;
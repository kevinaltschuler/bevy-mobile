'use strict';

var React = require('react-native');
var {
  TouchableOpacity,
  StyleSheet
} = React;

var {
  Icon
} = require('react-native-icons');

var BevyListButton = React.createClass({

  propTypes: {
    onPress: React.PropTypes.func
  },

  onPress: function() {
    this.props.onPress();
  },

  render: function() {
    return (
      <TouchableOpacity
        onPress={this.onPress}
        style={ styles.buttonContainer }
      >
        <Icon
          name='ion|navicon'
          size={30}
          color='white'
          style={styles.bevyListButton}
        />
      </TouchableOpacity>
    );
  }
});

var styles = StyleSheet.create({
  buttonContainer: {
    flex: 1
  },
  bevyListButton: {
    width: 30,
    height: 30
  }
});

module.exports = BevyListButton;
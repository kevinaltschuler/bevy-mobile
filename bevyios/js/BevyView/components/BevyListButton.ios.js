'use strict';

var React = require('react-native');
var {
  TouchableHighlight,
  StyleSheet
} = React;

var Icon = require('FAKIconImage');

var BevyListButton = React.createClass({

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
          name='ion|navicon'
          size={30}
          color='white'
          style={styles.bevyListButton}
        />
      </TouchableHighlight>
    );
  }
});

var styles = StyleSheet.create({
  bevyListButton: {
    paddingLeft: 45,
    width: 30,
    height: 30
  }
});

module.exports = BevyListButton;
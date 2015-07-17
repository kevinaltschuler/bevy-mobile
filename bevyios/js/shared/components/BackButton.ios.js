'use strict';

var React = require('react-native');
var {
  StyleSheet,
  TouchableHighlight,
} = React;
var {
  Icon
} = require('react-native-icons');

var BackButton = React.createClass({

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
        onPress={ this.onPress } 
        style={ styles.backButtonContainer } 
      >
        <Icon
          name='ion|chevron-left'
          size={ 30 }
          color='#666'
          style={ styles.backButton }
        />
      </TouchableHighlight>
    );
  }
});

var styles = StyleSheet.create({
  backButtonContainer: {
    flex: 1
  },
  backButton: {
    width: 30,
    height: 30,
  }
});

module.exports = BackButton;
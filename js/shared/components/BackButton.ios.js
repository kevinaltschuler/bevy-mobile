'use strict';

var React = require('react-native');
var {
  StyleSheet,
  TouchableOpacity
} = React;
var {
  Icon
} = require('react-native-icons');

var BackButton = React.createClass({

  propTypes: {
    onPress: React.PropTypes.func,
    color: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      color: '#666'
    };
  },

  onPress: function() {
    this.props.onPress();
  },

  render: function() {
    return (
      <TouchableOpacity
        activeOpacity={ 0.5 }
        onPress={ this.onPress } 
        style={ styles.backButtonContainer } 
      >
        <Icon
          name='ion|chevron-left'
          size={ 30 }
          color={ this.props.color }
          style={ styles.backButton }
        />
      </TouchableOpacity>
    );
  }
});

var styles = StyleSheet.create({
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48
  },
  backButton: {
    paddingLeft: 15,
    paddingRight: 15,
    width: 30,
    height: 30
  }
});

module.exports = BackButton;
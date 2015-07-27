'use strict';

var React = require('react-native');
var {
  TouchableHighlight,
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
      <TouchableHighlight
        onPress={this.onPress}
        underlayColor='rgba(0,0,0,0.2)'
        style={ styles.buttonContainer }
      >
        <Icon
          name='ion|navicon'
          size={ 30 }
          color='white'
          style={styles.bevyListButton}
        />
      </TouchableHighlight>
    );
  }
});

var styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingLeft: 20,
    paddingRight: 20
  },
  bevyListButton: {
    width: 30,
    height: 30
  }
});

module.exports = BevyListButton;
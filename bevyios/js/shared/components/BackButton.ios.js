'use strict';

var React = require('react-native');
var {
  StyleSheet,
  TouchableHighlight,
  Image
} = React;

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
        underlayColor='rgba(0,0,0,.1)'
        onPress={ this.onPress } 
        style={ styles.backButtonContainer } 
      >
        <Image 
          source={require('image!back_button')} 
          style={styles.backButton} 
        />
      </TouchableHighlight>
    );
  }
});

var styles = StyleSheet.create({
  backButtonContainer: {
    flex: 1,
    height: 32,
    width: 32
  },
  backButton: {
    width: 12,
    height: 19,
  }
});

module.exports = BackButton;
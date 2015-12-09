'use strict';

var React = require('react-native');
var {
  TouchableOpacity,
  StyleSheet,
  View
} = React;
var Icon = require('react-native-vector-icons/Ionicons');

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
        activeOpacity={ 0.5 }
        style={ styles.buttonContainer }
      >
          <Icon
            name='ios-drag'
            size={ 35 }
            color='white'
            style={styles.bevyListButton}
          />
      </TouchableOpacity>
    );
  }
});

var styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    width: 60,
    paddingLeft: 20,
    marginLeft: 0,
    marginRight: 0
  },
  bevyListButton: {
    width: 35,
    height: 35
  }
});

module.exports = BevyListButton;
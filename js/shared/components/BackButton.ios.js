'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} = React;
var Icon = require('react-native-vector-icons/Ionicons');

var BackButton = React.createClass({

  propTypes: {
    onPress: React.PropTypes.func,
    color: React.PropTypes.string,
    text: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      color: '#666',
      text: null
    };
  },

  onPress: function() {
    this.props.onPress();
  },

  _renderText() {
    if(!this.props.text) return <View />;
    return (
      <Text style={[ styles.backButtonText, {
        color: this.props.color
      } ]}>
        { this.props.text }
      </Text>
    );
  },

  render: function() {
    return (
      <TouchableOpacity
        activeOpacity={ 0.5 }
        onPress={ this.onPress } 
        style={ styles.backButtonContainer } 
      >
        <View style={ styles.backButton }>
          <Icon
            name='ios-arrow-left'
            size={ 30 }
            color={ this.props.color }
            style={ styles.backButtonIcon }
          />
          { this._renderText() }
        </View>
      </TouchableOpacity>
    );
  }
});

var styles = StyleSheet.create({
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: 'rgba(0,0,0,0)',
    marginLeft: 5
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  backButtonIcon: {
    paddingLeft: 5,
    paddingRight: 5,
    width: 30,
    height: 30
  },
  backButtonText: {
    fontSize: 15
  }
});

module.exports = BackButton;
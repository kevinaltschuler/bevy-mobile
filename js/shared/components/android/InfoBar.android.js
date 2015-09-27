/**
 * InfoBar.android.js
 * @author albert
 *
 * just like Navbar.ios.js, except more generic
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TouchableNativeFeedback,
  StyleSheet
} = React;

var constants = require('./../../../constants');
var noop = function() {};

var InfoBar = React.createClass({
  propTypes: {
    backButton: React.PropTypes.bool,
    backButtonText: React.PropTypes.string,
    backButtonOnPress: React.PropTypes.func,

    title: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      backButton: false,
      backButtonText: 'Back',
      backButtonOnPress: noop,
      title: 'Default Title'
    };
  },

  _renderBackButton() {
    if(!this.props.backButton) return <View />;
    return (
      <TouchableNativeFeedback
        background={ TouchableNativeFeedback.Ripple('#aaa', false) }
        onPress={ this.props.backButtonOnPress }
      >
        <View style={ styles.backButton }>
          <Text style={ styles.backButtonText }>{ this.props.backButtonText }</Text>
        </View>
      </TouchableNativeFeedback>
    );
  },

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.title }>
          <Text style={ styles.titleText }>{ this.props.title }</Text>
        </View>
        { this._renderBackButton() }
        
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    width: constants.width,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fff'
  },
  backButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 8,
    paddingRight: 8
  },
  backButtonText: {
    color: '#000',
    fontSize: 15
  },

  title: {
    position: 'absolute',
    width: constants.width,
    height: 48,
    top: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleText: {
    flex: 1,
    color: '#000',
    fontSize: 15,
    textAlign: 'center'
  }
});

module.exports = InfoBar;
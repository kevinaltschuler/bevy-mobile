/**
 * ChatBar.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback
} = React;

var _ = require('underscore');
var routes = require('./../../../routes');
var constants = require('./../../../constants');
var ChatStore = require('./../../ChatStore');

var ChatBar = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    activeThread: React.PropTypes.object
  },

  getInitialState() {
    return {
      //activeRoute: routes.LOGIN.LOGIN
    };
  },

  onBack() {
    this.props.mainNavigator.pop();
  },

  _renderBackButton() {
    return (
      <TouchableNativeFeedback
        onPress={ this.onBack }
      >
        <View style={ styles.backButton }>
          <Text style={ styles.backButtonText }>Back</Text>
        </View>
      </TouchableNativeFeedback>
    );
  },

  _renderTitle() {
    var title = 'Default Title';
    if(!_.isEmpty(this.props.activeThread)) {
      title = ChatStore.getThreadName(this.props.activeThread._id);
    }
    return title;
  },

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.title }>
          <Text style={ styles.titleText }>{ this._renderTitle() }</Text>
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
    paddingLeft: 12,
    paddingRight: 12
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


module.exports = ChatBar;
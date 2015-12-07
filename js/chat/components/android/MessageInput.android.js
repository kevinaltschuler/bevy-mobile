/**
 * ChatInput.android.js
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TextInput,
  TouchableNativeFeedback,
  StyleSheet
} = React;
var Icon = require('./../../../shared/components/android/Icon.android.js');

var _ = require('underscore');
var constants = require('./../../../constants');

var MessageInput = React.createClass({
  propTypes: {
    onSubmitEditing: React.PropTypes.func,
    onFocus: React.PropTypes.func,
    onBlur: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      onSubmitEditing: _.noop,
      onFocus: _.noop,
      onBlur: _.noop
    };
  },

  getInitialState() {
    return {
      messageInput: ''
    };
  },

  focus() {
    this.refs.MessageInput.focus();
  },
  blur() {
    this.refs.MessageInput.blur();
  },

  onFocus() {
    this.props.onFocus();
  },
  onBlur() {
    this.props.onBlur();
  },

  onSubmitEditing(ev) {
    this.props.onSubmitEditing(this.state.messageInput);
    this.setState({
      messageInput: ''
    });
  },

  render() {
    return (
      <View style={ styles.container }>
        <TextInput
          ref='MessageInput'
          value={ this.state.messageInput }
          style={ styles.messageInput }
          onChangeText={(text) => this.setState({ messageInput: text })}
          onSubmitEditing={ this.onSubmitEditing }
          onFocus={ this.onFocus }
          onBlur={ this.onBlur }
          placeholder='Chat'
          placeholderTextColor='#AAA'
          underlineColorAndroid='#FFF'
        />
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#888', false) }
          onPress={ this.onSubmitEditing }
        >
          <View style={ styles.sendMessageButton }>
            <Icon
              name='send'
              size={ 30 }
              color='#2CB673'
            />
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    height: 48,
    width: constants.width,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 8,
    borderTopColor: '#EEE',
    borderTopWidth: 1
  },
  messageInput: {
    flex: 1
  },
  sendMessageButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    paddingLeft: 12,
    paddingRight: 12
  }
});

module.exports = MessageInput;
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
  TouchableOpacity,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/Ionicons');

var _ = require('underscore');
var constants = require('./../../constants');

var MessageInput = React.createClass({
  propTypes: {
    onSubmitEditing: React.PropTypes.func,
    marginBottom: React.PropTypes.number
  },

  getDefaultProps() {
    return {
      onSubmitEditing: _.noop
    };
  },

  getInitialState() {
    return {
      messageInput: ''
    };
  },

  onSubmitEditing(ev) {
    this.props.onSubmitEditing(this.state.messageInput);
    this.setState({
      messageInput: ''
    });
  },

  render() {
    return (
      <View style={[styles.container, {marginBottom: this.props.marginBottom} ]}>
        <TextInput
          ref='MessageInput'
          value={ this.state.messageInput }
          style={ styles.messageInput }
          onChangeText={(text) => this.setState({ messageInput: text })}
          onSubmitEditing={ this.onSubmitEditing }
          placeholder='Chat'
          placeholderTextColor='#AAA'
          underlineColorAndroid='#FFF'
        />
        <TouchableOpacity
          activeOpacity={.5}
          onPress={ this.onSubmitEditing }
        >
          <Text style={ styles.sendMessageButton }>
            Send
          </Text>
        </TouchableOpacity>
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
    flex: 1,
    paddingLeft: 10
  },
  sendMessageButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    paddingLeft: 12,
    paddingRight: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2cb673'
  }
});

module.exports = MessageInput;
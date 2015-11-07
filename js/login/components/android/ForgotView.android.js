/**
 * ForgotView.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TextInput,
  TouchableNativeFeedback,
  BackAndroid,
  StyleSheet
} = React;

var routes = require('./../../../routes');
var constants = require('./../../../constants');

var ForgotView = React.createClass({
  propTypes: {
    loginRoute: React.PropTypes.object,
    loginNavigator: React.PropTypes.object
  },

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.onBackButton);
  },
  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.onBackButton);
  },

  onBackButton() {
    this.props.loginNavigator.pop();
    return true;
  },

  render() {
    return (
      <View style={ styles.container }>
        <TextInput
          style={ styles.emailInput }
          autoCorrect={ false }
          keyboardType='email-address'
          placeholder='Email Address (required)'
          placeholderTextColor='#EEE'
          underlineColorAndroid='#FFF'
        />
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#FFF', false) }
          onPress={() => {}}
        >
          <View style={ styles.requestButton }>
            <Text style={ styles.requestButtonText }>Send Code</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#2CB673'
  },
  emailInput: {
    width: (constants.width / 3) * 2,
    color: '#FFF',
    marginBottom: 10
  },
  requestButton: {
    width: (constants.width / 3) * 2,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    marginBottom: 10
  },
  requestButtonText: {
    color: '#000'
  }
});

module.exports = ForgotView;
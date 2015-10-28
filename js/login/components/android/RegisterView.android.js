/**
 * RegisterView.android.js
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

var RegisterView = React.createClass({
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
        <Text style={ styles.title }>Create An Account</Text>
        <TextInput
          style={ styles.usernameInput }
          autoCorrect={ false }
          placeholder='Username'
          placeholderTextColor='#EEE'
          underlineColorAndroid='#FFF'
        />
        <TextInput
          style={ styles.passwordInput }
          autoCorrect={ false }
          placeholder='Password'
          placeholderTextColor='#EEE'
          secureTextEntry={ true }
          underlineColorAndroid='#FFF'
        />
        <TextInput
          style={ styles.emailInput }
          autoCorrect={ false }
          keyboardType='email-address'
          placeholder='Email Address (optional)'
          placeholderTextColor='#EEE'
          underlineColorAndroid='#FFF'
        />

        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#FFF', false) }
          onPress={() => {}}
        >
          <View style={ styles.registerButton }>
            <Text style={ styles.registerButtonText }>Create Account</Text> 
          </View>
        </TouchableNativeFeedback>

        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#FFF', false) }
          onPress={() => {}}
        >
          <View style={ styles.googleRegisterButton }>
            <Text style={ styles.googleRegisterButtonText }>Create an Account with Google</Text> 
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
    backgroundColor: '#2CB673',
  },
  title: {
    color: '#FFF',
    fontSize: 24,
    textAlign: 'center',
    marginTop: 20
  },

  usernameInput: {
    width: (constants.width / 3) * 2,
    color: '#FFF',
    marginBottom: 10
  },
  passwordInput: {
    width: (constants.width / 3) * 2,
    color: '#FFF',
    marginBottom: 10
  },
  emailInput: {
    width: (constants.width / 3) * 2,
    color: '#FFF',
    marginBottom: 10
  },
  registerButton: {
    width: (constants.width / 3) * 2,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 24,
    marginBottom: 10
  },
  registerButtonText: {
    color: '#000'
  },
  googleRegisterButton: {
    width: (constants.width / 3) * 2,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DF4A32',
    borderRadius: 24,
    marginBottom: 10
  },
  googleRegisterButtonText: {
    color: '#FFF'
  }
});

module.exports = RegisterView;
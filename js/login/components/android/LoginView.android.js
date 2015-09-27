/**
 * LoginView.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  Text,
  View,
  TextInput,
  TouchableNativeFeedback,
  StyleSheet
} = React;

var routes = require('./../../../routes')
var constants = require('./../../../constants');

var LoginView = React.createClass({
  propTypes: {
    mainRoute: React.PropTypes.object,
    mainNavigator: React.PropTypes.object,
    loginRoute: React.PropTypes.object,
    loginNavigator: React.PropTypes.object
  },

  render() {
    return(
      <View style={ styles.container }>
        <Text style={ styles.titleText }>Bevy</Text>
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

        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#FFF', false) }
          onPress={() => {}}
        >
          <View style={ styles.logInButton }>
            <Text style={ styles.logInButtonText }>Sign In</Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#FFF', false) }
          onPress={() => {}}
        >
          <View style={ styles.googleLogInButton }>
            <Text style={ styles.googleLogInButtonText }>Sign In With Google</Text>
          </View>
        </TouchableNativeFeedback>

        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#FFF', false) }
          onPress={() => {
            this.props.loginNavigator.push(routes.LOGIN.REGISTER);
          }}
        >
          <View style={ styles.registerButton }>
            <Text style={ styles.registerButtonText }>Create An Account</Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#FFF', false) }
          onPress={() => {
            this.props.loginNavigator.push(routes.LOGIN.FORGOT);
          }}
        >
          <View style={ styles.forgotButton }>
            <Text style={ styles.forgotButtonText }>Forgot Password?</Text>
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

  titleText: {
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

  logInButton: {
    width: (constants.width / 3) * 2,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 24,
    marginBottom: 10
  },
  logInButtonText: {
    color: '#000'
  },
  googleLogInButton: {
    width: (constants.width / 3) * 2,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DF4A32',
    borderRadius: 24,
    marginBottom: 10
  },
  googleLogInButtonText: {
    color: '#FFF'
  },

  registerButton: {
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  registerButtonText: {
    color: '#FFF'
  },
  forgotButton: {
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingLeft: 10,
    paddingRight: 10
  },
  forgotButtonText: {
    color: '#FFF'
  }
});

module.exports = LoginView;
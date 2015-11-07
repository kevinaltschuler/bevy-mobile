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
  ToastAndroid,
  StyleSheet
} = React;

var _ = require('underscore');
var routes = require('./../../../routes');
var constants = require('./../../../constants');
var UserActions = require('./../../../user/UserActions');
var UserStore = require('./../../../user/UserStore');
var AppActions = require('./../../../app/AppActions');
var USER = constants.USER;

var RegisterView = React.createClass({
  propTypes: {
    loginRoute: React.PropTypes.object,
    loginNavigator: React.PropTypes.object,
    mainNavigator: React.PropTypes.object
  },

  getInitialState() {
    return {
      username: '',
      password: '',
      email: '',
      error: ''
    };
  },

  componentDidMount() {
    UserStore.on(USER.LOGIN_SUCCESS, this.onLoginSuccess);
    UserStore.on(USER.LOGIN_ERROR, this.onLoginError);
    BackAndroid.addEventListener('hardwareBackPress', this.onBackButton);
  },
  componentWillUnmount() {
    UserStore.off(USER.LOGIN_SUCCESS, this.onLoginSuccess);
    UserStore.off(USER.LOGIN_ERROR, this.onLoginError);
    BackAndroid.removeEventListener('hardwareBackPress', this.onBackButton);
  },

  onLoginSuccess(user) {
    // user was created and set in the store
    // reload the app and pop back to the main tab bar
    AppActions.load();
    // go back to tab bar
    this.props.mainNavigator.pop();
    // make sure the login navigator is set back to default
    this.props.loginNavigator.pop();
  },
  onLoginError(error) {
    this.setState({
      error: error
    });
  },

  onBackButton() {
    this.props.loginNavigator.pop();
    return true;
  },

  register() {
    // idiot proof
    if(_.isEmpty(this.state.username)) {
      this.setState({
        error: 'Please Enter A Username'
      });
      return;
    } else if (_.isEmpty(this.state.password)) {
      this.setState({
        error: 'Please Enter A Password'
      });
      return;
    }

    UserActions.register(
      this.state.username,
      this.state.password,
      this.state.email
    );
  },

  registerGoogle() {
    ToastAndroid.show('Feature Not Supported Yet', ToastAndroid.SHORT);
  },

  _renderError() {
    if(_.isEmpty(this.state.error)) return <View />;
    return (
      <View style={ styles.error }>
        <Text style={ styles.errorText }>
          { this.state.error }
        </Text>
      </View>
    );
  },

  render() {
    return (
      <View style={ styles.container }>
        { this._renderError() }
        <TextInput
          style={ styles.usernameInput }
          value={ this.state.username }
          autoCorrect={ false }
          placeholder='Username'
          placeholderTextColor='#EEE'
          underlineColorAndroid='#FFF'
          onChangeText={text => this.setState({ username: text })}
        />
        <TextInput
          style={ styles.passwordInput }
          value={ this.state.password }
          autoCorrect={ false }
          placeholder='•••••••'
          placeholderTextColor='#EEE'
          secureTextEntry={ true }
          underlineColorAndroid='#FFF'
          onChangeText={text => this.setState({ password: text })}
        />
        <TextInput
          style={ styles.emailInput }
          value={ this.state.email }
          autoCorrect={ false }
          keyboardType='email-address'
          placeholder='Email Address (optional)'
          placeholderTextColor='#EEE'
          underlineColorAndroid='#FFF'
          onChangeText={text => this.setState({ email: text })}
        />

        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#FFF', false) }
          onPress={ this.register }
        >
          <View style={ styles.registerButton }>
            <Text style={ styles.registerButtonText }>
              Create Account
            </Text> 
          </View>
        </TouchableNativeFeedback>

        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#FFF', false) }
          onPress={ this.registerGoogle }
        >
          <View style={ styles.googleRegisterButton }>
            <Text style={ styles.googleRegisterButtonText }>
              Create an Account with Google
            </Text> 
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
  error: {
    backgroundColor: '#DF4A32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10
  },
  errorText: {
    color: '#FFF'
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
    marginBottom: 10
  },
  googleRegisterButtonText: {
    color: '#FFF'
  }
});

module.exports = RegisterView;
/**
 * LoginView.ios.js
 * @author albert
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  NativeAppEventEmitter
} = React;

var _ = require('underscore');
var constants = require('./../../../constants');
var USER = constants.USER;
var routes = require('./../../../routes');
var AppActions = require('./../../../app/AppActions');
var UserActions = require('./../../../user/UserActions');
var UserStore = require('./../../../user/UserStore');

var LoginView = React.createClass({
  propTypes: {
    loginNavigator: React.PropTypes.object,
    message: React.PropTypes.string
  },

  getInitialState() {
    return {
      username: '',
      pass: '',
      error: '',
      loading: false
    }
  },

  componentDidMount() {
    UserStore.on(USER.LOGIN_ERROR, this.onError);
  },

  componentWillUnmount() {
    UserStore.off(USER.LOGIN_ERROR, this.onError);
  },

  onError(error) {
    this.setState({ error: error });
  },

  loginEmail() {
    if(_.isEmpty(this.state.username)) {
      this.setState({
        error: 'Please enter a username'
      });
      this.UsernameInput.focus();
      return;
    }

    if(_.isEmpty(this.state.pass)) {
      this.setState({
        error: 'Please enter a password'
      });
      this.PasswordInput.focus();
      return;
    }

    UserActions.logIn(this.state.username, this.state.pass);
    // blur inputs
    this.UsernameInput.blur();
    this.PasswordInput.blur();
  },

  loginGoogle() {
    if(this.state.loading) return;
    // blur inputs
    this.UsernameInput.blur();
    this.PasswordInput.blur();

    UserActions.logInGoogle();
    this.setState({
      error: '',
      username: '',
      pass: '',
      loading: true
    });
  },

  goToRegister() {
    // blur inputs
    this.UsernameInput.blur();
    this.PasswordInput.blur();

    this.props.loginNavigator.push({
      name: routes.LOGIN.REGISTER
    });
  },

  goToForgot() {
    // blur inputs
    this.UsernameInput.blur();
    this.PasswordInput.blur();

    this.props.loginNavigator.push({
      name: routes.LOGIN.FORGOT
    });
  },

  _renderError() {
    if(_.isEmpty(this.state.error)) return <View />;
    return (
      <View style={ styles.errorContainer }>
        <Text style={ styles.errorText }>
          { this.state.error }
        </Text>
      </View>
    );
  },

  render() {
    return (
      <View style={ styles.container }>
        <Image
          style={ styles.logo }
          source={ require('./../../../images/logo_100_reversed.png') }
        />
        <View style={styles.title}>
          <Text style={styles.titleText}>
            Bevy
          </Text>
        </View>
        { this._renderError() }
        <TextInput
          ref={ref => { this.UsernameInput = ref; }}
          autoCorrect={ false }
          autoCapitalize='none'
          placeholder='Username'
          style={ styles.loginInput }
          onChangeText={text => this.setState({ username: text }) }
          placeholderTextColor='rgba(255,255,255,.5)'
        />
        <TextInput
          ref={ref => { this.PasswordInput = ref; }}
          autoCorrect={ false }
          autoCapitalize='none'
          secureTextEntry={ true }
          placeholder='Password'
          style={ styles.loginInput }
          onChangeText={text => this.setState({ pass: text }) }
          placeholderTextColor='rgba(255,255,255,.5)'
        />
        <TouchableOpacity
          activeOpacity={ 0.5 }
          style={ styles.loginButton }
          onPress={ this.loginEmail }>
          <Text style={ styles.loginButtonText }>
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={ 0.5 }
          style={ styles.loginButtonGoogle }
          onPress={ this.loginGoogle }
        >
          <Text style={ styles.loginButtonTextGoogle }>
            Login With Google
          </Text>
        </TouchableOpacity>
        <View style={ styles.textButtons }>
          <TouchableOpacity
            activeOpacity={ 0.5 }
            style={[ styles.textButton, {
              borderRightWidth: 1,
              borderRightColor: '#fff'
            }]}
            onPress={ this.goToRegister }
          >
            <Text style={ styles.textButtonText }>Create An Account</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={ 0.5 }
            style={ styles.textButton }
            onPress={ this.goToForgot }
          >
            <Text style={ styles.textButtonText }>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    width: constants.width,
    backgroundColor: '#2cb673',
    flexDirection: 'column',
    paddingBottom: 5,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: constants.width / 4,
    paddingHorizontal: constants.width / 12
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10
  },
  title: {
    alignItems: 'center',
    marginBottom: 20
  },
  titleText: {
    fontSize: 28,
    color: '#fff'
  },
  logInTitle: {
    textAlign: 'center',
    fontSize: 17,
    color: '#666',
    marginBottom: 10
  },
  errorContainer: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: '#df4a32',
    borderRadius: 5,
    marginBottom: 10
  },
  errorText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 17
  },
  loginInput: {
    height: 50,
    paddingLeft: 16,
    borderColor: '#fff',
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 25,
    width: constants.width / 1.2,
    color: '#fff'
  },
  loginButton: {
    padding: 10,
    backgroundColor: '#fff',
    height: 50,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginBottom: 10,
    marginHorizontal: 20,
    width: constants.width / 1.2
  },
  loginButtonText: {
    fontSize: 17,
    textAlign: 'center',
    color: '#666'
  },
  loginButtonGoogle: {
    backgroundColor: '#df4a32',
    padding: 10,
    marginBottom: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 25,
    marginHorizontal: 20,
    width: constants.width / 1.2
  },
  loginButtonTextGoogle: {
    fontSize: 17,
    textAlign: 'center',
    color: '#fff',
  },
  textButtons: {
    flexDirection: 'row',
    marginTop: 10,
    width: constants.width
  },
  textButton: {
    flexDirection: 'column',
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  textButtonText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#eee'
  }
});

module.exports = LoginView;

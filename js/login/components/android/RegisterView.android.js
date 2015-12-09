/**
 * RegisterView.android.js
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
  BackAndroid,
  ToastAndroid,
  ProgressBarAndroid,
  StyleSheet
} = React;
var Icon = require('./../../../shared/components/android/Icon.android.js');

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
      error: '',
      loading: false,
      verified: false,
      verifying: false
    };
  },

  componentDidMount() {
    UserStore.on(USER.LOGIN_SUCCESS, this.onLoginSuccess);
    UserStore.on(USER.LOGIN_ERROR, this.onLoginError);
    UserStore.on(USER.VERIFY_SUCCESS, this.onVerifySuccess);
    UserStore.on(USER.VERIFY_ERROR, this.onVerifyError);
    BackAndroid.addEventListener('hardwareBackPress', this.onBackButton);
  },
  componentWillUnmount() {
    UserStore.off(USER.LOGIN_SUCCESS, this.onLoginSuccess);
    UserStore.off(USER.LOGIN_ERROR, this.onLoginError);
    UserStore.off(USER.VERIFY_SUCCESS, this.onVerifySuccess);
    UserStore.off(USER.VERIFY_ERROR, this.onVerifyError);
    BackAndroid.removeEventListener('hardwareBackPress', this.onBackButton);
  },

  onLoginSuccess(user) {
    // user was created and set in the store
    // clear state
    this.setState(this.getInitialState());
    // reload the app
    AppActions.load();
    // go back to tab bar
    this.props.mainNavigator.pop();
    // make sure the login navigator is set back to default
    this.props.loginNavigator.pop();
  },
  onLoginError(error) {
    this.setState({
      error: error,
      loading: false
    });
  },

  onVerifySuccess(res) {
    this.setState({
      verified: !res.found,
      verifying: false,
      error: (res.found)
        ? 'Username taken. Please enter another one'
        : ''
    });
  },
  onVerifyError(error) {
    this.setState({
      verified: false,
      verifying: false
    });
  },

  onBackButton() {
    this.props.loginNavigator.pop();
    return true;
  },

  onChangeUsername(text) {
    this.setState({
      username: text,
      verifying: true
    });
    if(this.verifyTimeout != undefined) {
      clearTimeout(this.verifyTimeout);
      delete this.verifyTimeout;
    }
    this.verifyTimeout = setTimeout(this.verifyUsername, 500)
  },

  verifyUsername() {
    if(_.isEmpty(this.state.username)) {
      this.setState({
        verified: false
      });
      return;
    }
    UserActions.verifyUsername(this.state.username);
    this.setState({
      verified: false,
      verifying: true
    });
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
    } else if (!this.state.verified) {
      this.setState({
        error: 'Username taken. Please enter another one'
      });
      return;
    }

    // send action
    UserActions.register(
      this.state.username,
      this.state.password,
      this.state.email
    );

    // set loading flag
    this.setState({
      error: '',
      loading: true
    });
  },

  registerGoogle() {
    ToastAndroid.show('Feature Not Supported Yet', ToastAndroid.SHORT);
  },

  _renderLoading() {
    if(!this.state.loading) return <View />;
    return (
      <View style={ styles.progressContainer }>
        <ProgressBarAndroid styleAttr='SmallInverse' />
        <Text style={ styles.progressText }>
          Registering...
        </Text>
      </View>
    );
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

  _renderVerified() {
    if(_.isEmpty(this.state.username)) return <View />;
    if(this.state.verifying) {
      return (
        <ProgressBarAndroid styleAttr='SmallInverse' />
      );
    } else if(this.state.verified) {
      return (
        <Icon
          name='check'
          size={ 30 }
          color='#FFF'
        />
      );
    } else if (!this.state.verified) {
      return (
        <Icon
          name='close'
          size={ 30 }
          color='#DF4A32'
        />
      );
    }
  },

  render() {
    return (
      <View style={ styles.container }>
        { this._renderError() }
        { this._renderLoading() }
        <View style={ styles.usernameContainer }> 
          <TextInput
            style={ styles.usernameInput }
            value={ this.state.username }
            autoCorrect={ false }
            placeholder='Username'
            placeholderTextColor='#EEE'
            underlineColorAndroid='#FFF'
            onChangeText={ this.onChangeUsername }
          />
          { this._renderVerified() }
        </View>
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
    marginVertical: 10,
    elevation: 2
  },
  errorText: {
    color: '#FFF'
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressText: {
    marginLeft: 10,
    color: '#FFF'
  },
  usernameContainer: {
    width: constants.width * 2 / 3,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  usernameInput: {
    flex: 1,
    color: '#FFF',
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
    marginBottom: 10,
    borderRadius: 5,
    elevation: 2
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
    marginBottom: 10,
    borderRadius: 5,
    elevation: 2
  },
  googleRegisterButtonText: {
    color: '#FFF'
  }
});

module.exports = RegisterView;
/**
 * ForgotView.ios.js
 * description: the forgotten password page on IOS
 * @author Ben
 */

'use strict';

var React = require('react-native');
var {
  View,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  Text,
  Image,
  AlertIOS
} = React;

var _ = require('underscore');
var constants = require('./../../../constants');
var UserActions = require('./../../../user/UserActions');
var UserStore = require('./../../../user/UserStore');
var USER = constants.USER;

var ForgotView = React.createClass({
  propTypes: {
    loginNavigator: React.PropTypes.object,
    loginRoute: React.PropTypes.object
  },

  getInitialState() {
    return {
      error: '',
      email: ''
    };
  },

  componentDidMount() {
    UserStore.on(USER.RESET_PASSWORD_SUCCESS, this.onSuccess);
    UserStore.on(USER.RESET_PASSWORD_ERROR, this.onError);
  },
  componentWillUnmount() {
    UserStore.off(USER.RESET_PASSWORD_SUCCESS, this.onSuccess);
    UserStore.off(USER.RESET_PASSWORD_ERROR, this.onError);
  },

  onSuccess() {
    // success
    AlertIOS.alert('Forgot Password',
      'Email Sent! Please check your email and go to '
      + 'the link provided to reset your password.');
    // clear text field
    this.setState({
      email: ''
    });
  },

  onError(error) {
    // error
    this.setState({
      error: error
    });
  },

  goBack() {
    // blur inputs
    this.EmailInput.blur();
    // pop navigator
    this.props.loginNavigator.pop();
  },

  submit() {
    if(_.isEmpty(this.state.email)) {
      this.setState({
        error: 'Please enter an email address'
      });
      return;
    }

    UserActions.resetPassword(this.state.email);

    // clear error
    this.setState({
      error: ''
    });
    // blur inputs
    this.EmailInput.blur();
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
          source={{ uri: constants.siteurl + '/img/logo_100_reversed.png' }}
        />
        <View style={ styles.title }>
          <Text style={ styles.titleText }>
            Forgot Password?
          </Text>
          <Text style={ styles.subTitleText }>
            We can help with that
          </Text>
        </View>
        { this._renderError() }
        <TextInput
          ref={ref => { this.EmailInput = ref; }}
          autoCorrect={ false }
          autoCapitalize='none'
          autoFocus={ true }
          placeholder='Email Address'
          keyboardType='email-address'
          placeholderTextColor='rgba(255,255,255,.5)'
          style={ styles.textInput }
          value={ this.state.email }
          onChangeText={text => this.setState({email: text})}
        />
        <TouchableOpacity
          activeOpacity={ 0.5 }
          style={ styles.sendButton }
          onPress={ this.submit }>
          <Text style={ styles.sendButtonText }>
            Send
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={ 0.5 }
          style={ styles.textButton }
          onPress={ this.goBack }
        >
          <Text style={ styles.textButtonText }>
            Back To Login
          </Text>
        </TouchableOpacity>
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
    paddingTop: constants.width / 3,
    paddingHorizontal: constants.width / 12
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10
  },
  title: {
    alignItems: 'center',
    marginBottom: 10
  },
  titleText: {
    fontSize: 28,
    color: '#fff',
    marginBottom: 8
  },
  subTitleText: {
    fontSize: 18,
    color: '#FFF'
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
    color: '#FFF',
    fontSize: 17
  },
  textInput: {
    height: 50,
    paddingLeft: 16,
    borderColor: '#fff',
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 25,
    width: constants.width / 1.2,
    color: '#fff'
  },
  sendButton: {
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
  sendButtonText: {
    fontSize: 17,
    textAlign: 'center',
    color: '#666'
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
    fontSize: 17,
    color: '#eee'
  }
});

module.exports = ForgotView;

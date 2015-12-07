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
  ToastAndroid,
  ProgressBarAndroid,
  StyleSheet
} = React;

var _ = require('underscore');
var routes = require('./../../../routes');
var constants = require('./../../../constants');
var UserStore = require('./../../../user/UserStore');
var UserActions = require('./../../../user/UserActions');
var USER = constants.USER;

var ForgotView = React.createClass({
  propTypes: {
    loginRoute: React.PropTypes.object,
    loginNavigator: React.PropTypes.object,
    mainNavigator: React.PropTypes.object
  },

  getInitialState() {
    return {
      email: '',
      error: '',
      loading: ''
    };
  },

  componentDidMount() {
    UserStore.on(USER.RESET_PASSWORD_SUCCESS, this.onSuccess);
    UserStore.on(USER.RESET_PASSWORD_ERROR, this.onError);
    BackAndroid.addEventListener('hardwareBackPress', this.onBackButton);
  },
  componentWillUnmount() {
    UserStore.off(USER.RESET_PASSWORD_SUCCESS, this.onSuccess);
    UserStore.off(USER.RESET_PASSWORD_ERROR, this.onError);
    BackAndroid.removeEventListener('hardwareBackPress', this.onBackButton);
  },

  onSuccess() {
    this.setState({
      error: '',
      loading: false
    });

    // show success to user
    ToastAndroid.show(
      'Email Sent! Please check your email and go to' 
      + 'the link provided to reset your password.', ToastAndroid.SHORT);
  },
  onError(error) {
    this.setState({
      error: error,
      loading: false
    });
  },

  onBackButton() {
    this.props.loginNavigator.pop();
    return true;
  },

  resetPassword() {
    // idiot proof
    if(_.isEmpty(this.state.email)) {
      this.setState({
        error: 'Please Enter Your Email'
      });
    }
    // call action
    UserActions.resetPassword(this.state.email);
    // reset error and set loading flag
    this.setState({
      error: '',
      loading: true
    });
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

  _renderLoading() {
    if(!this.state.loading) return <View />;
    return (
      <View style={ styles.progressContainer }>
        <ProgressBarAndroid styleAttr='SmallInverse' />
        <Text style={ styles.progressText }>
          Processing...
        </Text>
      </View>
    );
  },

  render() {
    return (
      <View style={ styles.container }>
        { this._renderError() }
        { this._renderLoading() }
        <TextInput
          style={ styles.emailInput }
          value={ this.state.email }
          autoCorrect={ false }
          keyboardType='email-address'
          placeholder='Email Address (required)'
          placeholderTextColor='#EEE'
          underlineColorAndroid='#FFF'
          onChangeText={text => this.setState({ email: text })}
        />
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#FFF', false) }
          onPress={ this.resetPassword }
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
    marginBottom: 10,
    borderRadius: 5,
    elevation: 2
  },
  requestButtonText: {
    color: '#000'
  }
});

module.exports = ForgotView;
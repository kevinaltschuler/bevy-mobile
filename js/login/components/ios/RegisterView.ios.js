/**
 * RegisterView.ios.js
 *
 * View in the login stack that allows a user to create an account
 * After creation, immediately logs the user into the app
 *
 * @author albert
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  Text,
  DeviceEventEmitter,
  Image
} = React;
var Spinner = require('react-native-spinkit');
var Icon = require('react-native-vector-icons/MaterialIcons');

var _ = require('underscore');
var constants = require('./../../../constants');
var UserStore = require('./../../../user/UserStore');
var UserActions = require('./../../../user/UserActions');

var usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
var emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

var RegisterView = React.createClass({
  propTypes: {
    loginNavigator: React.PropTypes.object,
    loginRoute: React.PropTypes.object
  },

  getInitialState() {
    return {
      // textinput values that we track
      username: '',
      pass: '',
      email: '',
      // any error with validation or verificatoin is put here
      error: '',
      // vars to track the state of validation and verification
      // used by UI to display errors or loading indicators
      verified: false,
      valid: false,
      verifying: false,
      // used to move view around the keyboard
      keyboardSpace: 0
    };
  },

  componentDidMount() {
    this.keyboardWillShowSub = DeviceEventEmitter.addListener('keyboardWillShow', this.onKeyboardShow);
    this.keyboardWillHideSub = DeviceEventEmitter.addListener('keyboardWillHide', this.onKeyboardHide);
  },
  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  },

  onKeyboardShow(frames) {
    if(frames.end) {
      this.setState({ keyboardSpace: frames.end.height });
    } else {
      this.setState({ keyboardSpace: frames.endCoordinates.height });
    }
    setTimeout(this.scrollToBottom, 300);
  },
  onKeyboardHide(frames) {
    this.setState({ keyboardSpace: 0 });
    setTimeout(this.scrollToTop, 300);
  },

  onInputFocus() {
  },
  onInputBlur() {
  },

  scrollToTop() {
    if(this.ScrollView == undefined) return;
    this.ScrollView.scrollTo({ x: 0, y: 0 });
  },

  scrollToBottom() {
    // dont even try if the scroll view hasn't mounted yet
    if(this.ScrollView == undefined) return;

    var innerScrollView = this.ScrollView.refs.InnerScrollView;
    var scrollView = this.ScrollView.refs.ScrollView;

    requestAnimationFrame(() => {
      innerScrollView.measure((innerScrollViewX, innerScrollViewY,
        innerScrollViewWidth, innerScrollViewHeight) => {

        scrollView.measure((scrollViewX, scrollViewY, scrollViewWidth, scrollViewHeight) => {
          var scrollTo = innerScrollViewHeight - scrollViewHeight + innerScrollViewY;

          if(innerScrollViewHeight < scrollViewHeight) {
            return;
          }

          this.ScrollView.scrollTo({ x: 0, y: scrollTo });
        });
      });
    });
  },

  register() {
    if(this.state.verifying) return;

    if(!this.isUsernameValid() || !this.isPasswordValid() || !this.isEmailValid())
      return;

    if (!this.state.verified) {
      this.setState({
        error: 'Username already taken'
      });
      return;
    }

    // clear error
    this.setState({
      error: ''
    });
    // blur inputs
    this.UsernameInput.blur();
    this.PasswordInput.blur();
    this.EmailInput.blur();
    // send action
    UserActions.register(this.state.username, this.state.pass, this.state.email)
  },

  verifyUsername() {
    // check validity before checking for duplicate username on server
    if(!this.isUsernameValid()) {
      this.setState({
        verifying: false,
        valid: false
      });
      return;
    }

    // username seems fine here. check the server for duplicates
    this.setState({ valid: true });

    // dont send the request if there's no username here
    // this should get caught earlier but keep this here just in case
    if(_.isEmpty(this.state.username)) {
      this.setState({
        verified: false,
        verifying: false,
        valid: false
      });
      return;
    }

    // send network request
    fetch(constants.apiurl + '/users/' + this.state.username + '/verify', {
      method: 'GET'
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        verified: !res.found,
        verifying: false
      });
    })
    .catch(err => {
      this.setState({
        error: err.toString(),
        verified: false,
        verifying: false
      });
    });
  },

  isUsernameValid() {
    if(_.isEmpty(this.state.username)) {
      this.setState({
        error: 'Please enter a username'
      });
      return false;
    } else if (this.state.username.length < 3) {
      this.setState({
        error: 'Username must be at least 3 characters in length'
      });
      return false;
    } else if (this.state.username.length > 16) {
      this.setState({
        error: 'Username cannot be more than 16 characters in length'
      });
      return false;
    } else if(!usernameRegex.test(this.state.username)) {
      this.setState({
        error: 'Only characters a-z, numbers, underscores, and dashes are allowed'
      });
      return false;
    }
    return true;
  },

  isPasswordValid() {
    if(_.isEmpty(this.state.pass)) {
      this.setState({
        error: 'Please enter a password'
      });
      return false;
    }
    return true;
  },

  isEmailValid() {
    if(!_.isEmpty(this.state.email) && !emailRegex.test(this.state.email)) {
      this.setState({
        error: 'Invalid Email'
      });
      return false;
    }
    return true;
  },

  onUsernameChange(text) {
    if(_.isEmpty(text)) {
      // nothing was entered.
      // clear the error and dont check for validity
      this.setState({
        username: text,
        error: ''
      });
      return;
    }
    this.setState({
      username: text,
      verifying: true
    });

    if(this.usernameTimeout != undefined) {
      clearTimeout(this.usernameTimeout);
      delete this.usernameTimeout;
    }
    this.usernameTimeout = setTimeout(this.verifyUsername, 250);
  },

  goBack() {
    // clear state
    this.setState(this.getInitialState());
    // blur inputs
    this.UsernameInput.blur();
    this.PasswordInput.blur();
    this.EmailInput.blur();
    // pop navigator
    this.props.loginNavigator.pop();
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

  _renderVerified() {
    if(_.isEmpty(this.state.username)) return <View />;
    if(!this.state.valid) return <View />;
    if(this.state.verifying) {
      // render spinner
      return (
        <View style={ styles.verifyContainer }>
          <Spinner
            isVisible={ true }
            size={ 24 }
            type={ 'Arc' }
            color='#FFFFFF'
            style={ styles.spinner }
          />
          <Text style={ styles.spinnerText }>
            Verifying Username...
          </Text>
        </View>
      );
    }
    if(!this.state.verified) {
      // render x
      return (
        <View style={ styles.verifyContainer }>
          <Icon
            name='close'
            size={ 30 }
            color='#FFF'
            style={ styles.verifyIcon }
          />
          <Text style={ styles.verifyText }>
            Username Taken
          </Text>
        </View>
      );
    } else {
      // render check
      return (
        <View style={ styles.verifyContainer }>
          <Icon
            name='done'
            size={ 30 }
            color='#FFF'
            style={ styles.verifyIcon }
          />
          <Text style={ styles.verifyText }>
            Username Available
          </Text>
        </View>
      );
    }
  },

  render: function() {
    return (
      <ScrollView
        ref={ ref => { this.ScrollView = ref; }}
        style={[ styles.container, {
          marginBottom: this.state.keyboardSpace
        }]}
        contentContainerStyle={ styles.containerInner }
        keyboardShouldPersistTaps={ true }
        //scrollEnabled={ false }
      >
        <Image
          style={ styles.logo }
          source={ require('./../../../images/logo_100_reversed.png') }
        />
        <View style={ styles.title }>
          <Text style={ styles.titleText }>
            Register
          </Text>
        </View>
        { this._renderError() }
        { this._renderVerified() }
        <View style={ styles.inputContainer }>
          <TextInput
            ref={ref => { this.UsernameInput = ref; }}
            autoCorrect={ false }
            autoCapitalize='none'
            keyboardType='default'
            placeholder='Username'
            placeholderTextColor='rgba(255,255,255,.6)'
            style={ styles.textInput }
            value={ this.state.username }
            onChangeText={ this.onUsernameChange }
            onFocus={ this.onInputFocus }
            onBlur={ this.onInputBlur }
          />
        </View>
        <View style={ styles.inputContainer }>
          <TextInput
            ref={ref => { this.PasswordInput = ref; }}
            autoCorrect={ false }
            autoCapitalize='none'
            placeholder='Password'
            placeholderTextColor='rgba(255,255,255,.6)'
            secureTextEntry={ true }
            style={ styles.textInput }
            value={ this.state.pass }
            onChangeText={text => this.setState({ pass: text })}
            onFocus={ this.onInputFocus }
            onBlur={ this.onInputBlur }
          />
        </View>
        <View style={ styles.inputContainer }>
          <TextInput
            ref={ref => { this.EmailInput = ref; }}
            autoCorrect={ false }
            autoCapitalize='none'
            placeholder='Email (Optional)'
            placeholderTextColor='rgba(255,255,255,.6)'
            keyboardType='email-address'
            style={ styles.textInput }
            value={ this.state.email }
            onChangeText={text => this.setState({ email: text })}
            onFocus={ this.onInputFocus }
            onBlur={ this.onInputBlur }
          />
        </View>
        <TouchableOpacity
          activeOpacity={ 0.5 }
          style={ styles.registerButton }
          onPress={ this.register }
        >
          <Text style={ styles.registerButtonText }>Create Account</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={ 0.5 }
          style={ styles.textButton }
          onPress={ this.goBack }
        >
          <Text style={ styles.textButtonText }>Back To Login</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    width: constants.width,
    backgroundColor: '#2CB673',
  },
  containerInner: {
    paddingTop: 75,
    paddingBottom: 5,
    flexDirection: 'column',
    alignItems: 'center'
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
    color: '#fff'
  },
  registerTitle: {
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
    color: '#FFF',
    fontSize: 17
  },
  inputContainer: {
    width: constants.width - 60,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  textInput: {
    flex: 1,
    height: 50,
    paddingLeft: 16,
    borderColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
    borderRadius: 25,
    color: '#fff'
  },
  verifyContainer: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  spinnerText: {
    color: '#FFF',
    fontSize: 15,
    marginLeft: 10
  },
  verifyText: {
    color: '#FFF',
    fontSize: 15,
    marginLeft: 10
  },
  registerButton: {
    padding: 10,
    backgroundColor: '#fff',
    height: 50,
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 25,
    marginBottom: 10,
    marginHorizontal: 20,
    width: constants.width - 60
  },
  registerButtonText: {
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
    fontSize: 15,
    color: '#FFFC'
  }
});

module.exports = RegisterView;

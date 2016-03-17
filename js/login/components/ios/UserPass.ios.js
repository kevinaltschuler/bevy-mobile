/**
 * UserPass.ios.js
 *
 * enter ur username and password here
 *
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  DeviceEventEmitter
} = React;

var _ = require('underscore');
var constants = require('./../../../constants');
var USER = constants.USER;
var Icon = require('react-native-vector-icons/MaterialIcons');
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
      // textinput values that we track
      email: '',
      pass: '',
      // any errors with logging in or verification
      error: '',
      // used by UI to display loading indicator or not
      loading: false,
      // used to move view around keyboard
      keyboardSpace: 0
    }
  },

  componentDidMount() {
    UserStore.on(USER.LOGIN_ERROR, this.onError);

    this.keyboardWillShowSub = DeviceEventEmitter.addListener('keyboardWillShow', this.onKeyboardShow);
    this.keyboardWillHideSub = DeviceEventEmitter.addListener('keyboardWillHide', this.onKeyboardHide);

    this.EmailInput.focus();
  },
  componentWillUnmount() {
    UserStore.off(USER.LOGIN_ERROR, this.onError);

    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  },

  onError(error) {
    this.setState({ error: error });
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

  onEmailSubmit(text) {
    this.PasswordInput.focus();
  },

  scrollToTop() {
    if(this.ScrollView == undefined) return;
    this.ScrollView.scrollTo(0, 0);
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

          this.ScrollView.scrollTo(scrollTo, 0);
        });
      });
    });
  },

  loginEmail() {
    // if the request is already pending, then get out of here
    if(this.state.loading) return;

    // load username and password from the TextFields
    var email = this.state.email;
    var password = this.state.pass;

    // break out if the username is empty
    if(_.isEmpty(email)) {
      this.setState({ error: 'Please enter your email address' });
      return;
    }
    // check the validity of the email by just checking if there are characters
    // before and after an @ symbol. super simple no regex
    if(email.split('@').length != 2) {
      this.setState({ error: 'Please enter a valid email address' });
      return;
    }
    // clear the username error if we got here
    this.setState({ error: '' });
    // break out if password is empty
    if(_.isEmpty(password)) {
      this.setState({ error: 'Please enter your password' });
      return;
    }
    // clear the password error if we got here
    this.setState({ error: '' });

    UserActions.logIn(email, password, this.props.slug);
  },

  goToForgot() {
    // blur inputs
    this.EmailInput.blur();
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
      <ScrollView
        ref={ ref => { this.ScrollView = ref; }}
        style={[ styles.container, {
          marginBottom: this.state.keyboardSpace
        }]}
        contentContainerStyle={ styles.containerInner }
        keyboardShouldPersistTaps={ true }
        //scrollEnabled={ false }
      >
        <View style={styles.navbar}>
          <TouchableOpacity
            activeOpacity={.4}
            onPress={() => {
              this.props.loginNavigator.pop();
            }}
          >
            <Icon
              name='arrow-back'
              size={ 30 }
              color='#FFF'
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={.4}
            onPress={() => {
              this.loginEmail();
            }}
          >
            <Text style={[styles.nextButton, {
              opacity: (this.state.email.length > 0 && this.state.pass.length > 0) ? 1 : .75
            }]}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.title}>
          <Text style={styles.titleText}>
            {this.props.slug + ".joinbevy.com"}
          </Text>
        </View>
        { this._renderError() }
        <TextInput
          ref={ref => { this.EmailInput = ref; }}
          autoCorrect={ false }
          autoCapitalize='none'
          placeholder='Email'
          style={ styles.loginInput }
          onChangeText={ text => this.setState({ email: text }) }
          onSubmitEditing={ this.onEmailSubmit }
          placeholderTextColor='rgba(255,255,255,.5)'
        />
        <TextInput
          ref={ref => { this.PasswordInput = ref; }}
          autoCorrect={ false }
          autoCapitalize='none'
          secureTextEntry={ true }
          placeholder='Password'
          style={ styles.loginInput }
          onChangeText={ text => this.setState({ pass: text }) }
          placeholderTextColor='rgba(255,255,255,.5)'
        />
        <TouchableOpacity
          activeOpacity={ 0.5 }
          style={ styles.textButton }
          onPress={ this.goToForgot }
        >
          <Text style={ styles.textButtonText }>Forgot Password?</Text>
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
    flexDirection: 'column',
    paddingBottom: 5,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 20
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
    height: 30,
    color: '#fff',
    flex: 1,
    fontSize: 25,
    width: 500,
    marginVertical: 10
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
    width: constants.width,
    justifyContent: 'center'
  },
  textButton: {
    flexDirection: 'column',
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  textButtonText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#eee'
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: constants.width / 3,
    paddingTop: 30,
    paddingRight: 40,
    flex: 1,
    width: constants.width
  },
  nextButton: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  }
});

module.exports = LoginView;

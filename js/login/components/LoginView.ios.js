'use strict';

var React = require('react-native');
var {
  Text,
  View,
  StyleSheet,
  TextInput,
  AsyncStorage,
  LinkingIOS,
  TouchableHighlight
} = React;

var _ = require('underscore');
var constants = require('./../../constants');
var routes = require('./../../routes');
var AppActions = require('./../../app/AppActions');
var UserStore = require('./../../profile/UserStore');

var LoginView = React.createClass({

  propTypes: {
    loginNavigator: React.PropTypes.object,
    authModalActions: React.PropTypes.object,
    message: React.PropTypes.string
  },

  getInitialState() {
    return {
      email: '',
      pass: '',
      error: ''
    }
  },

  loginEmail() {
    fetch(constants.siteurl + '/login',
    {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.pass
      })
    })
    // on fetch
    .then((res) => (res.json()))
    .then((res) => {
      if(res.object == undefined) {
        this.onLoginSuccess(res);
      } else {
        this.setState({error: res.message});
      }
    });
  },

  loginGoogle() {
    // see if we've logged in before
    AsyncStorage.getItem('google_id')
    .then((google_id) => {
      if(google_id) {
        // yes we have, and we have the token
        // we can skip doing the oauth2 grant request
        fetch(constants.apiurl + '/users/google/' + google_id)
        .then(($res) => {
          var user = JSON.parse($res._bodyText);
          this.onLoginSuccess(user);
        });
      } else {
        // no one has logged in before or has consciously signed out
        // do oauth via the browser, and listen for the callback
        LinkingIOS.addEventListener('url', this.handleGoogleURL);
        LinkingIOS.openURL([
          'https://accounts.google.com/o/oauth2/auth',
          '?response_type=code',
          '&client_id=' + constants.google_client_id,
          '&redirect_uri=' + constants.google_redirect_uri,
          '&scope=email%20profile'
        ].join(''));
      }
    });
  },

  handleGoogleURL: function(event) {
    // when the browser gets back to us
    // it should only send an access code that we use to get the oauth token
    LinkingIOS.removeEventListener('url', this.handleGoogleURL);
    var url = event.url;
    var code = url.slice(38); // jenky query parser
    console.log('got access code', code);
    var body = [
      'code=' + code,
      '&client_id=' + constants.google_client_id,
      '&client_secret=' + constants.google_client_secret,
      '&redirect_uri=' + constants.google_redirect_uri,
      '&grant_type=authorization_code'
    ].join('');
    // get the token
    fetch('https://www.googleapis.com/oauth2/v3/token', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body
    }).then((res) => {
      var response = JSON.parse(res._bodyText);
      var access_token = response.access_token;
      console.log('got access token', access_token);
      // get the google plus user, so we can get its id
      fetch(
        'https://www.googleapis.com/plus/v1/people/me' + 
        '?access_token=' + access_token, {
      })
      .then(($res) => {
        var $response = JSON.parse($res._bodyText);
        var google_id = $response.id;
        // save this token so we dont have to go through that again
        // unless we have to
        AsyncStorage.setItem('google_id', google_id);
        // finally we can query our own api
        fetch(constants.apiurl + '/users/google/' + google_id)
        .then(($user) => {
          var user = JSON.parse($user._bodyText);
          this.onLoginSuccess(user);
        });
      });
    });
  },

  onLoginSuccess(user) {
    console.log('success', user);

    UserStore.setUser(user);
    AppActions.load();

    this.setState({
      email: '',
      pass: '',
      error: ''
    });
    this.props.authModalActions.close();
  },

  _renderError() {
    if(_.isEmpty(this.state.error)) return <View />;
    return (
      <Text style={ styles.errorText }>{ this.state.error }</Text>
    );
  },

  render() {
    return (
      <View style={ styles.container }>
        <Text style={ styles.logInTitle }>{ this.props.message }</Text>
        { this._renderError() }
        <View style={{
          flex: 1,
          height: 1,
          backgroundColor: '#ddd'
        }} />
        <TextInput
          autoCorrect={ false }
          autoCapitalize='none'
          placeholder='Email Address'
          keyboardType='email-address'
          style={ styles.loginInput }
          onChangeText={ (text) => this.setState({ email: text }) }
          placeholderTextColor='#aaa'
        />
        <View style={{
          flex: 1,
          height: 1,
          backgroundColor: '#ddd'
        }} />
        <TextInput
          autoCorrect={ false }
          autoCapitalize='none'
          password={ true }
          placeholder='•••••••'
          style={ styles.loginInput }
          onChangeText={ (text) => this.setState({ pass: text }) }
          placeholderTextColor='#aaa'
        />
        <View style={{
          flex: 1,
          height: 1,
          backgroundColor: '#ddd',
          marginBottom: 15
        }} />
        <TouchableHighlight 
          style={ styles.loginButton }
          underlayColor='rgba(44,182,105,0.8)'
          onPress={ this.loginEmail }>
          <Text style={ styles.loginButtonText }>
            Login
          </Text>
        </TouchableHighlight>
        <TouchableHighlight 
          style={ styles.loginButtonGoogle }
          underlayColor='rgba(223,74,50,0.8)'
          onPress={ this.loginGoogle }>
          <Text style={ styles.loginButtonTextGoogle }>
            Login With Google
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor='#eee'
          style={[ styles.textButton, { borderBottomColor: '#eee', borderBottomWidth: 1 } ]}
          onPress={() => {
            this.props.loginNavigator.change('register');
          }}
        >
          <Text style={[ styles.textButtonText, { fontSize: 17 } ]}>Create An Account</Text>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor='#eee'
          style={ styles.textButton }
          onPress={() => {
            this.props.loginNavigator.change('forgot');
          }}
        >
          <Text style={ styles.textButtonText }>Forgot Password?</Text>
        </TouchableHighlight>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 250,
    backgroundColor: '#fff',
    flexDirection: 'column',
    borderRadius: 5,
    paddingTop: 15,
    paddingBottom: 5
  },
  logInTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    color: '#666',
    marginBottom: 10
  },
  errorText: {
    flex: 1,
    textAlign: 'center',
    color: '#df4a32',
    marginBottom: 5
  },
  loginInput: {
    flex: 1,
    height: 40,
    paddingLeft: 16,
    color: '#000'
  },
  loginButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#2CB673'
  },
  loginButtonText: {
    flex: 1,
    fontSize: 17,
    textAlign: 'center',
    color: '#fff'
  },
  loginButtonGoogle: {
    flex: 1,
    backgroundColor: '#df4a32',
    padding: 10,
    marginBottom: 10
  },
  loginButtonTextGoogle: {
    flex: 1,
    fontSize: 17,
    textAlign: 'center',
    color: '#fff',
  },

  textButton: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textButtonText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666'
  }
});

module.exports = LoginView;
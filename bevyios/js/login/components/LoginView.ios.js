/**
 * LoginView.js
 * kevin made this
 */
'use strict';

var React = require('react-native');
var {
  View,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Text,
  Navigator,
  Image,
  LinkingIOS,
  AsyncStorage
} = React;

// modules
var backgroundImage = require('image!loginBackground');
var bevy_logo_trans = require('image!bevy_logo_trans');
var AppActions = require('./../../app/AppActions');

var _ = require('underscore');
var api = require('./../../utils/api');
var constants = require('./../../constants');
var routes = require('./../../routes');

var LoginView = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object,
    loginNavigator: React.PropTypes.object
  },

  getInitialState: function(){
    return {
      email: 'a@b.c',
      pass: 'a',
      error: ''
    };
  },

  toRegister: function() {
    this.props.loginNavigator.jumpTo(routes.LOGIN.REGISTER);
  },

  toForgotPass: function() {
    this.props.loginNavigator.jumpTo(routes.LOGIN.FORGOT);
  },

  handleSubmit: function() {
    api.auth(this.state.email, this.state.pass)
    .then((res) => {
      if(res.object == undefined) {
        this.setState({
          user:res
        });

        api.storeUser(res);

        AppActions.load();

        this.props.navigator.jumpTo(routes.MAIN.TABBAR);

        this.setState({
          email: '',
          pass: '',
          error: ''
        });

      } else {
        this.setState({error: res.message});
      }
    });
  },

  // when the google login button is pressed
  onGoogleLogin: function() {

    // see if we've logged in before
    AsyncStorage.getItem('google_id')
      .then((google_id) => {
        if(google_id) {
          // yes we have, and we have the token
          // we can skip doing the oauth2 grant request

          // fetch the google plus profile data
          console.log(google_id);

          fetch(constants.apiurl + '/users/google/' + google_id)
          .then(($res) => {

            var user = JSON.parse($res._bodyText);
            this.setState({
              user: user
            });

            api.storeUser(user);

            AppActions.load();

            this.props.navigator.jumpTo(routes.MAIN.TABBAR);

            this.setState({
              email: '',
              pass: '',
              error: ''
            });

          });
        } else {
          // no one has logged in before or has consciously signed out
          // do oauth via the browser, and listen for the callback

          LinkingIOS.addEventListener('url', this.handleGoogleURL);

          console.log(constants.google_redirect_uri);

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
    console.log(url, code);

    var body = [
      'code=' + code + '&',
      'client_id=' + constants.google_client_id +'&',
      'client_secret=' + constants.google_client_secret + '&',
      'redirect_uri=' + constants.google_redirect_uri + '&',
      'grant_type=authorization_code'
    ].join('');
    console.log(body);
    
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
            this.setState({
              user: user
            });

            api.storeUser(user);

            AppActions.load();

            this.props.navigator.jumpTo(routes.MAIN.TABBAR);

            this.setState({
              email: '',
              pass: '',
              error: ''
            });

          });
      });
    });
  },

  render: function() {
    return ( 
      <View style={ styles.container }>  
        <View style={styles.loginContainer}>

          <View style={styles.loginRowLogo}>
            <Image
              style={styles.logo}
              source={bevy_logo_trans}
            />
          </View>


          <View style={styles.loginRow}>
            <Text style={styles.loginTitle}>
              Bevy
            </Text>
          </View>

          <View style={styles.loginRowText}>
            <Text style={styles.loginSubTitle}>
              {this.state.error}
            </Text>
          </View>

          <View style={styles.loginRow}>
            <TextInput
              autoCorrect={false}
              placeholder='email'
              style={styles.loginInput}
              onChangeText={(text) => this.setState({email: text})}
              placeholderTextColor='rgba(255,255,255,.6)'
            />
          </View>

          <View style={styles.loginRow}>
            <TextInput
              autoCorrect={false}
              password={true}
              placeholder='•••••••'
              style={styles.loginInput}
              onChangeText={(text) => this.setState({pass: text})}
              placeholderTextColor='rgba(255,255,255,.6)'
            />
          </View>

          <View style={styles.loginRow}>
            <TouchableHighlight 
              style={styles.loginButton}
              activeOpacity={80}
              underlayColor="#edeeee"
              onPress={this.handleSubmit}>
              <Text style={styles.loginButtonText}>
                login
              </Text>
            </TouchableHighlight>
          </View>

          <View style={styles.loginRow}>
            <TouchableHighlight 
              style={styles.loginButtonGoogle}
              activeOpacity={80}
              underlayColor="#CB442E"
              onPress={ this.onGoogleLogin }>
              <Text style={styles.loginButtonTextGoogle}>
                login with google
              </Text>
            </TouchableHighlight>
          </View>

          <View style={styles.loginRow}>
            <TouchableHighlight 
              activeOpacity={20}
              onPress={this.toForgotPass}
              underlayColor='rgba(0,0,0,0)'
            >
              <Text style={styles.loginSubTitle}>
                lost password
              </Text>
            </TouchableHighlight>

            <Text style={styles.loginSubTitle}>
              &nbsp; | &nbsp;
            </Text>

            <TouchableHighlight 
              activeOpacity={80}
              onPress={this.toRegister}
              underlayColor='rgba(0,0,0,0)'
            >
              <Text style={styles.loginSubTitle}>
                register
              </Text>
            </TouchableHighlight>
          </View>

        </View>
      </View>
    );
  }

});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2CB673'
  },
  loginContainer: {
    backgroundColor: 'rgba(0,0,0,0)',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    marginTop: 80
  },
  loginRow: {
    flexDirection: 'row',
    padding: 6,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  loginRowLogo: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  loginRowText: {
    flexDirection: 'row',
    paddingTop: 0,
    paddingBottom: 10,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  loginTitle: {
    textAlign: 'center',
    fontSize: 30,
    color: 'white'
  },
  loginSubTitle: {
    textAlign: 'center',
    fontSize: 12,
    color: 'white'
  },
  loginInput: {
    alignSelf: 'center',
    height: 40,
    width: 200,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 16,
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'white'
  },
  loginButton: {
    alignSelf: 'center',
    padding: 10,
    width: 200,
    borderRadius: 20,
    backgroundColor: 'white'
  },
  loginButtonGoogle: {
    alignSelf: 'center',
    backgroundColor: '#df4a32',
    padding: 10,
    width: 200,
    borderRadius: 20,
  },
  loginButtonText: {
    textAlign: 'center',
    color: 'black',
  },
  loginButtonTextGoogle: {
    textAlign: 'center',
    color: 'white',
  },
  logo: {
    width: 50,
    height: 50,
  },
})

module.exports = LoginView;
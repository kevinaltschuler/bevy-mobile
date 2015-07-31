'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableHighlight,
  AsyncStorage,
  LinkingIOS
} = React;
var {
  Icon
} = require('react-native-icons');
var Modal = require('react-native-modal');

var _ = require('underscore');
var constants = require('./../../constants');

var LoginModal = React.createClass({

  propTypes: {
    isOpen: React.PropTypes.bool,
    message: React.PropTypes.string
  },

  getInitialState() {
    return {
      isOpen: this.props.isOpen,
      message: this.props.message,
      email: '',
      pass: '',
      error: ''
    }
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      isOpen: nextProps.isOpen,
      message: nextProps.message
    });
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
    var body = [
      'code=' + code + '&',
      'client_id=' + constants.google_client_id +'&',
      'client_secret=' + constants.google_client_secret + '&',
      'redirect_uri=' + constants.google_redirect_uri + '&',
      'grant_type=authorization_code'
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
    /*this.setState({
      user:res
    });

    AppActions.load();

    this.props.mainNavigator.replace(routes.MAIN.TABBAR);

    this.setState({
      email: '',
      pass: '',
      error: ''
    });*/
  },

  _renderError() {
    if(_.isEmpty(this.state.error)) return <View />;
    return (
      <Text style={ styles.errorText }>{ this.state.error }</Text>
    );
  },

  render() {
    return (
      <Modal
        forceToFront={ true }
        isVisible={ this.state.isOpen }
        style={ styles }
        backdropType="blur"
        backdropBlur="dark"
        customCloseButton={
          <TouchableHighlight
            underlayColor='rgba(255,255,255,0.1)'
            style={ styles.closeButton }
            onPress={() => {
              this.setState({
                isOpen: false
              });
            }}
          >
            <View style={ styles.closeButtonContainer }>
              <Text style={ styles.closeButtonText }>Close</Text>
              <Icon
                name='ion|ios-close-empty'
                size={ 30 }
                color='#fff'
                style={{ width: 30, height: 30 }}
              />
            </View>
          </TouchableHighlight>
        }
        onPressBackdrop={() => {
          //console.log('backdrop pressed');
          //this.setState({
          //  isOpen: false
          //});
        }}
        onClose={() => {
          this.setState({
            isOpen: false
          });
        }}
      >
        <Text style={ styles.logInTitle }>{ this.state.message }</Text>
        { this._renderError() }
        <TextInput
          autoCorrect={ false }
          autoCapitalize={ false }
          placeholder='email'
          style={ styles.loginInput }
          onChangeText={ (text) => this.setState({ email: text }) }
          placeholderTextColor='#aaa'
        />
        <TextInput
          autoCorrect={ false }
          autoCapitalize={ false }
          password={ true }
          placeholder='•••••••'
          style={ styles.loginInput }
          onChangeText={ (text) => this.setState({ pass: text }) }
          placeholderTextColor='#aaa'
        />
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
      </Modal>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: constants.width,
    height: constants.height,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: constants.width,
    height: constants.height,
    backgroundColor: '#000',
    opacity: 0.5
  },
  modal: {
    backgroundColor: '#eee',
    marginTop: 100,
    marginLeft: 20,
    marginRight: 20,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 15,
    borderRadius: 5
  },

  closeButton: {
    position: 'absolute',
    borderColor: '#fff',
    borderRadius: 2,
    borderWidth: 1,
    right: 20,
    top: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  closeButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  closeButtonText: {
    fontSize: 17,
    color: '#fff'
  },

  errorText: {
    color: '#df4a32',
    marginBottom: 5
  },

  logInTitle: {
    fontSize: 17,
    color: '#000',
    marginBottom: 10
  },
  loginInput: {
    alignSelf: 'center',
    height: 40,
    width: 200,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 16,
    marginBottom: 10,
    color: '#000'
  },
  loginButton: {
    alignSelf: 'center',
    padding: 10,
    width: 200,
    borderRadius: 20,
    marginBottom: 10,
    backgroundColor: '#2CB673'
  },
  loginButtonText: {
    textAlign: 'center',
    color: '#fff',
  },
  loginButtonGoogle: {
    alignSelf: 'center',
    backgroundColor: '#df4a32',
    padding: 10,
    width: 200,
    borderRadius: 20,
  },
  loginButtonTextGoogle: {
    textAlign: 'center',
    color: '#fff',
  }
});

module.exports = LoginModal;
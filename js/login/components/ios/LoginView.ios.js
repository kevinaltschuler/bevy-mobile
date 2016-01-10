'use strict';

var React = require('react-native');
var {
  Text,
  View,
  StyleSheet,
  TextInput,
  AsyncStorage,
  LinkingIOS,
  TouchableHighlight,
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
    UserStore.on(USER.LOGIN_SUCCESS, this.onLoginSuccess);
    UserStore.on(USER.LOGIN_ERROR, this.updateError);
  },

  componentWillUnmount() {
    UserStore.off(USER.LOGIN_SUCCESS, this.onLoginSuccess);
    UserStore.off(USER.LOGIN_ERROR, this.updateError);
  },

  updateError(error) {
    this.setState({
      error: error
    })
  },

  loginEmail() {
    UserActions.logIn(this.state.username, this.state.pass);
  },

  loginGoogle() {
    if(this.state.loading) return;
    UserActions.logInGoogle();
    this.setState({
      loading: true
    });
  },

  onLoginSuccess() {
    //this.props.mainNavigator.replace(routes.MAIN.TABBAR);
  },

  _renderError() {
    if(_.isEmpty(this.state.error)) return <View />;
    return (
      <Text style={ styles.errorText }>{ this.state.error }</Text>
    );
  },

  render() {
    var logoUrl = constants.apiurl + '/img/logo_100_reversed.png';
    return (
      <View style={ styles.container }>
        <Image style={styles.logo} source={{uri: logoUrl}}/>
        <View style={styles.title}>
          <Text style={styles.titleText}>
            Bevy
          </Text>
        </View>
        { this._renderError() }
        <TextInput
          autoCorrect={ false }
          autoCapitalize='none'
          placeholder='username'
          keyboardType='default'
          style={ styles.loginInput }
          onChangeText={ (text) => this.setState({ username: text }) }
          placeholderTextColor='rgba(255,255,255,.5)'
        />
        <TextInput
          autoCorrect={ false }
          autoCapitalize='none'
          password={ true }
          placeholder='•••••••'
          style={ styles.loginInput }
          onChangeText={ (text) => this.setState({ pass: text }) }
          placeholderTextColor='rgba(255,255,255,.5)'
        />
        <TouchableHighlight
          style={ styles.loginButton }
          underlayColor='rgba(255,255,255,.8)'
          onPress={ this.loginEmail }>
          <Text style={ styles.loginButtonText }>
            Login
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={ styles.loginButtonGoogle }
          underlayColor='rgba(223,74,50,0.8)'
          onPress={ this.loginGoogle }
        >
          <Text style={ styles.loginButtonTextGoogle }>
            Login With Google
          </Text>
        </TouchableHighlight>
        <View style={styles.textButtons}>
          <TouchableHighlight
            underlayColor='rgba(255,255,255,.1)'
            style={[styles.textButton, {borderRightWidth: 1, borderRightColor: '#fff'}]}
            onPress={() => {
              this.props.loginNavigator.change('register');
            }}
          >
            <Text style={[styles.textButtonText, ]}>Create An Account</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor='rgba(255,255,255,.1)'
            style={ styles.textButton }
            onPress={() => {
              this.props.loginNavigator.change('forgot');
            }}
          >
            <Text style={ styles.textButtonText }>Forgot Password?</Text>
          </TouchableHighlight>
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
    paddingTop: constants.width / 3,
    paddingHorizontal: constants.width / 12
  },
  logo: {
    width: 60,
    height: 60
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
  errorText: {
    textAlign: 'center',
    color: '#df4a32',
    marginBottom: 5
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
    marginTop: 10
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

/**
 * LoginView.js
 * kevin made this
 */
'use strict';

// get modules
var React = require('react-native');
var {
  View,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Text,
  Image
} = React;

var _ = require('underscore');
var constants = require('./../../../constants');
var UserStore = require('./../../../user/UserStore');
var AppActions = require('./../../../app/AppActions');

var RegisterView = React.createClass({
  propTypes: {
    message: React.PropTypes.string,
    loginNavigator: React.PropTypes.object,
    authModalActions: React.PropTypes.object
  },

  getInitialState() {
    return {
      username: '',
      pass: '',
      error: ''
    };
  },

  onRegister() {
    fetch(constants.apiurl + '/users', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.pass
      })
    })
    .then((res) => (res.json()))
    .then((res) => {
      if(res.object == undefined) {
        // success
        UserStore.setUser(res);
        AppActions.load();

        this.setState({
          username: '',
          pass: '',
          error: ''
        });
        this.props.authModalActions.close();
        this.props.close();
      } else {
        // error
        this.setState({ error: res.message });
      }
    })
  },

  _renderError() {
    if(_.isEmpty(this.state.error)) return <View />;
    return (
      <Text style={ styles.errorText }>{ this.state.error }</Text>
    );
  },

  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <Text style={styles.titleText}>
            Register
          </Text>
        </View>
        { this._renderError() }
        <TextInput
          autoCorrect={ false }
          autoCapitalize='none'
          keyboardType='default'
          placeholder='Username'
          placeholderTextColor='rgba(255,255,255,.5)'
          style={ styles.registerInput }
          value={ this.state.username }
          onChangeText={(text) => this.setState({ username: text })}
        />
        <TextInput
          autoCorrect={ false }
          autoCapitalize='none'
          password={ true }
          placeholder='•••••••'
          placeholderTextColor='rgba(255,255,255,.5)'
          style={ styles.registerInput }
          value={ this.state.pass }
          onChangeText={(text) => this.setState({ pass: text })}
        />
        <TouchableHighlight
          style={ styles.registerButton }
          underlayColor='rgba(44,182,105,0.8)'
          onPress={ this.onRegister }
        >
          <Text style={ styles.registerButtonText }>Create</Text>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor='#eee'
          style={ styles.textButton }
          onPress={() => {
            this.props.loginNavigator.change('login');
          }}
        >
          <Text style={ styles.textButtonText }>Back To Login</Text>
        </TouchableHighlight>
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
    paddingTop: constants.width / 2,
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
  registerTitle: {
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
  registerInput: {
    height: 50,
    paddingLeft: 16,
    borderColor: '#fff',
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 25,
    width: constants.width / 1.2,
    color: '#fff'
  },
  registerButton: {
    padding: 10,
    backgroundColor: '#fff',
    height: 50,
    flexDirection: 'column',
    borderRadius: 25,
    marginBottom: 10,
    marginHorizontal: 20,
    width: constants.width / 1.2
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
    fontSize: 14,
    color: '#eee'
  }
});

module.exports = RegisterView;

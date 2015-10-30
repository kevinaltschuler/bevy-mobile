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
var constants = require('./../../constants');
var UserStore = require('./../../user/UserStore');
var AppActions = require('./../../app/AppActions');

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
        { this._renderError() }
        <TextInput
          autoCorrect={ false }
          autoCapitalize='none'
          keyboardType='default'
          placeholder='Username'
          placeholderTextColor='#aaa'
          style={ styles.registerInput }
          value={ this.state.username }
          onChangeText={(text) => this.setState({ username: text })}
        />
        <TextInput
          autoCorrect={ false }
          autoCapitalize='none'
          password={ true }
          placeholder='•••••••'
          placeholderTextColor='#aaa'
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
    width: 250,
    backgroundColor: '#fff',
    flexDirection: 'column',
    borderRadius: 20,
    paddingTop: 15,
    paddingBottom: 5
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
    flex: 1,
    height: 40,
    paddingLeft: 16,
    color: '#000',
    borderBottomColor: '#ccc',
    borderBottomWidth: .5,
    marginBottom: 10
  },
  registerButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#2CB673',
    marginBottom: 10,
    borderRadius: 20,
    marginHorizontal: 10
  },
  registerButtonText: {
    flex: 1,
    fontSize: 17,
    textAlign: 'center',
    color: '#fff'
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

module.exports = RegisterView;

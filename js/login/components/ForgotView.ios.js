/**
*    ForgotView.js
*    description: the forgotten password page on IOS
*    by Ben 
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
  AlertIOS
} = React;

var _ = require('underscore');
var constants = require('./../../constants');

var ForgotView = React.createClass({

  propTypes: {
    message: React.PropTypes.string,
    loginNavigator: React.PropTypes.object
  },

  getInitialState: function() {
    return {
      subTitle: 'we can help with that',
      email: ''
    };
  },

  handleSubmit: function() {
    fetch(constants.siteurl + '/forgot', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: this.state.email
      })
    })
    .then((res) => (res.json()))
    .then((res) => {
      if(res.object == undefined) {
        // success
        AlertIOS.alert('Forgot Password', 
          'Email Sent! Please check your email and go to' 
          + 'the link provided to reset your password.');
        // clear text field
        this.setState({
          email: ''
        });
      } else {
        // error
        this.setState({
          subTitle: res.message
        });
      }
    });
  },

  render: function() {
    return ( 
      <View style={styles.container}>
        <Text style={styles.loginSubTitle}>
          { this.state.subTitle }
        </Text>
        <TextInput
          autoCorrect={false}
          autoCapitalize='none'
          placeholder='Email Address'
          keyboardType='email-address'
          placeholderTextColor='#aaa'
          style={ styles.loginInput }
          value={ this.state.email }
          onChangeText={(text) => this.setState({email: text})}
        />
        <TouchableHighlight 
          style={ styles.loginButton }
          underlayColor='rgba(44,182,105,0.8)'
          onPress={ this.handleSubmit }>
          <Text style={ styles.loginButtonText }>
            Send
          </Text>
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
    width: constants.width * 2 / 3,
    backgroundColor: '#fff',
    flexDirection: 'column',
    borderRadius: 20,
    paddingTop: 15,
    paddingBottom: 5
  },
  loginTitle: {
    textAlign: 'center',
    fontSize: 17,
    color: '#666'
  },
  loginSubTitle: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginBottom: 10
  },
  loginInput: {
    flex: 1,
    height: 40,
    paddingLeft: 16,
    color: '#000',
    borderBottomWidth: .5,
    borderBottomColor: '#ddd',
    marginBottom: 10
  },
  loginButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#2CB673',
    marginBottom: 10,
    borderRadius: 20,
    marginHorizontal: 10
  },
  loginButtonText: {
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
    alignItems: 'center',
    marginHorizontal: 10
  },
  textButtonText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    borderRadius: 20
  }
});

module.exports = ForgotView;

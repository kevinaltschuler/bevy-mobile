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
var constants = require('./../../../constants');

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
          'Email Sent! Please check your email and go to '
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
        <View style={styles.title}>
          <Text style={styles.titleText}>
            {this.state.subTitle}
          </Text>
        </View>
        <TextInput
          autoCorrect={false}
          autoCapitalize='none'
          placeholder='Email Address'
          keyboardType='email-address'
          placeholderTextColor='rgba(255,255,255,.5)'
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
          underlayColor='rgba(255,255,255,.5)'
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
  title: {
    alignItems: 'center',
    marginBottom: 20
  },
  titleText: {
    fontSize: 28,
    color: '#fff'
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

module.exports = ForgotView;

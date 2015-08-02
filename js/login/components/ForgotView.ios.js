/**
*    ForgotView.js
*    description: the forgotten password page on IOS
*    by Ben 
*/

'use strict';

// get modules
var React = require('react-native');
var _ = require('underscore');

var {
  View,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Text,
} = React;

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
    
  },

  render: function() {
    return ( 
      <View style={styles.container}>
        <Text style={styles.loginTitle}>
          Lost Password?
        </Text>
        <Text style={styles.loginSubTitle}>
          { this.state.subTitle }
        </Text>
        <View style={{
          flex: 1,
          height: 1,
          backgroundColor: '#ddd'
        }} />
        <TextInput
          autoCorrect={false}
          autoCapitalize='none'
          placeholder='Email Address'
          placeholderTextColor='#aaa'
          style={ styles.loginInput }
          onChangeText={(text) => this.setState({email: text})}
        />
        <View style={{
          flex: 1,
          height: 1,
          backgroundColor: '#ddd',
          marginBottom: 15
        }} />
        <TouchableHighlight 
          style={ styles.loginButton }
          underlayColor="#eee"
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
    width: 250,
    backgroundColor: '#fff',
    flexDirection: 'column',
    borderRadius: 5,
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
    color: '#000'
  },
  loginButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#2CB673',
    marginBottom: 10
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
    alignItems: 'center'
  },
  textButtonText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666'
  }
});

module.exports = ForgotView;

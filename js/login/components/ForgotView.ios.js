/**
*    ForgotView.js
*    description: the forgotten password page on IOS
*    by Ben 
*/

'use strict';

// get modules
var React = require('react-native');
var _ = require('underscore');
var api = require('./../../utils/api.js')

var {
  View,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Text,
  Image
} = React;

var ForgotView = React.createClass({

  getInitialState: function() {
    return {
      subTitle: 'we can help with that',
      email: ''
    };
  },

  handleSubmit: function() {
    api.forgotPass(this.state.email)
    .then((res) => {
      if (res.object == 'error') {
        this.setState({ subTitle: res.message });
      }
      else {
        this.setState({ subTitle: 'email sent!' });
      }
    });
  },

  render: function() {
    return ( 
      <View style={styles.loginContainer}>
        <View style={styles.loginRow}>
          <Text style={styles.loginTitle}>
            Lost Password?
          </Text>
        </View>

        <View style={styles.loginRowText}>
            <Text style={styles.loginSubTitle}>
              {this.state.subTitle}
            </Text>
          </View>

        <View style={styles.loginRow}>
          <TextInput
            autoCorrect={false}
            placeholder='email'
            placeholderTextColor='rgba(255,255,255,.6)'
            style={styles.loginInput}
            onChangeText={(text) => this.setState({email: text})}
          />
        </View>

        <View style={styles.loginRow}>
          <TouchableHighlight 
            style={styles.loginButton}
            activeOpacity={80}
            underlayColor="#edeeee"
            onPress={this.handleSubmit}>
            <Text style={styles.loginButtonText}>
              send
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  loginContainer: {
    backgroundColor: '#2CB673',
    flex: 1
  },
  loginRow: {
    flex: 1,
    alignItems: 'center',
    padding: 6,
    justifyContent: 'center'
  },
  loginRowLogo: {
    flexDirection: 'row',
    paddingTop: 80,
    justifyContent: 'center'
  },
  loginRowText: {
    flexDirection: 'row',
    paddingTop: 0,
    paddingBottom: 10,
    justifyContent: 'center'
  },
  loginTitle: {
    textAlign: 'center',
    fontSize: 30,
    color: 'white', 
    paddingTop: 130
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
  }
});

module.exports = ForgotView;
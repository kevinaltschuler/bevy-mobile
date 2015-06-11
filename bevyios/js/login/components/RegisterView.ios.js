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
  Image
} = React;

var styles = StyleSheet.create({
  loginConatiner: {
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#edeeee'
  },
  loginRow: {
    flexDirection: 'row',
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
    fontSize: 30
  },
  loginSubTitle: {
    textAlign: 'center',
    fontSize: 12
  },
  loginInput: {
    alignSelf: 'center',
    height: 40,
    width: 200,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  loginButton: {
    alignSelf: 'center',
    backgroundColor: '#2cb673',
    padding: 10,
    width: 200,
    borderRadius: 20,
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
    color: 'white',
  },
  logo: {
    width: 50,
    height: 50,
  }
})

var RegisterView = React.createClass({

  render: function() {
    return ( 
      <View style={styles.loginContainer}>

        <View style={styles.loginRow}>
          <Text style={styles.loginTitle}>
            Register
          </Text>
        </View>

        <View style={styles.loginRow}>
          <TextInput
            autoCorrect={false}
            placeholder='email'
            style={styles.loginInput}
            onChangeText={(text) => this.setState({input: text})}
          />
        </View>

        <View style={styles.loginRow}>
          <TextInput
            autoCorrect={false}
            password={true}
            placeholder='•••••••'
            style={styles.loginInput}
            onChangeText={(text) => this.setState({input: text})}
          />
        </View>

        <View style={styles.loginRow}>
          <TouchableHighlight 
            style={styles.loginButton}
            activeOpacity={80}
            underlayColor="#28A467">
            <Text style={styles.loginButtonText}>
              Register
            </Text>
          </TouchableHighlight>
        </View>

      </View>);
  }

});

module.exports = RegisterView;

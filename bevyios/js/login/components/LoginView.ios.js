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

var backgroundImage = require('image!loginBackground');

var RegisterView = require('./RegisterView.ios.js');

var Button = require('react-native-button');
var bevylogo = require('image!bevylogo');

var styles = StyleSheet.create({
  loginConatiner: {
    backgroundColor: 'rgba(0,0,0,0)',
  },
  loginRow: {
    flexDirection: 'row',
    padding: 6,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  loginRowLogo: {
    flexDirection: 'row',
    paddingTop: 80,
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
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'white'
  },
  loginButton: {
    alignSelf: 'center',
    padding: 10,
    width: 200,
    borderRadius: 20,
    borderColor: "white",
    borderWidth: 1,
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
  loginBackground: {
  },
  backgroundWrapper: {
    position: 'absolute',
    top: 0,

  },
  logo: {
    width: 50,
    height: 50,
  }
})

var LoginView = React.createClass({

  nextPage: function() {
    this.props.toRoute({
      name: "Register",
      component: RegisterView
    });
  },

  render: function() {
    return ( 
        <View style={styles.loginContainer}>
          <View style={styles.backgroundWrapper}>
            <Image source={backgroundImage} style={styles.loginBackground}/>
          </View>

          <View style={styles.loginRowLogo}>
            <Image
              style={styles.logo}
              source={bevylogo}
            />
          </View>


          <View style={styles.loginRow}>
            <Text style={styles.loginTitle}>
              Welcome
            </Text>
          </View>

          <View style={styles.loginRowText}>
            <Text style={styles.loginSubTitle}>
              bevy is waiting for you
            </Text>
          </View>

          <View style={styles.loginRow}>
            <TextInput
              autoCorrect={false}
              placeholder='email'
              style={styles.loginInput}
              onChangeText={(text) => this.setState({input: text})}
              placeholderTextColor='white'
            />
          </View>

          <View style={styles.loginRow}>
            <TextInput
              autoCorrect={false}
              password={true}
              placeholder='•••••••'
              style={styles.loginInput}
              onChangeText={(text) => this.setState({input: text})}
              placeholderTextColor='white'
            />
          </View>

          <View style={styles.loginRow}>
            <TouchableHighlight 
              style={styles.loginButton}
              activeOpacity={80}
              underlayColor="#28A467">
              <Text style={styles.loginButtonText}>
                login
              </Text>
            </TouchableHighlight>
          </View>

          <View style={styles.loginRow}>
            <TouchableHighlight 
              style={styles.loginButton}
              activeOpacity={80}
              underlayColor="#28A467">
              <Text style={styles.loginButtonText}>
                login with google
              </Text>
            </TouchableHighlight>
          </View>

          <View style={styles.loginRow}>
            <TouchableHighlight 
              activeOpacity={80}>
              <Text style={styles.loginSubTitle}>
                password
              </Text>
            </TouchableHighlight>
            <Text style={styles.loginSubTitle}>
              &nbsp; | &nbsp;
            </Text>
            <TouchableHighlight 
              activeOpacity={80}
              onPress={this.nextPage}>
              <Text style={styles.loginSubTitle}>
                register
              </Text>
            </TouchableHighlight>
          </View>

        </View>);
  }

});

module.exports = LoginView;
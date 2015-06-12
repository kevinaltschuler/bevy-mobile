/**
 * LoginView.js
 * kevin made this
 */
'use strict';

// get modules
var React = require('react-native');
var backgroundImage = require('image!loginBackground');

var {
  View,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Text,
  Image
} = React;

var styles = StyleSheet.create({
  loginContainer: {
    backgroundColor: 'rgba(0,0,0,0)',
    marginTop: 120
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
    backgroundColor: 'rgba(0,0,0,0)',
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
  loginBackground: {
  },
  backgroundWrapper: {
    position: 'absolute',
    top: -100,

  },
  logo: {
    width: 50,
    height: 50,
  }
})

var RegisterView = React.createClass({

  render: function() {
    return ( 
      <View>
        <View style={styles.backgroundWrapper}>
            <Image source={backgroundImage} style={styles.loginBackground}/>
        </View>

        <View style={styles.loginContainer}>

          <View style={styles.loginRow}>
            <Text style={styles.loginTitle}>
              Register
            </Text>
          </View>

          <View style={styles.loginRow}>
            <TouchableHighlight
              style={styles.imageButton}
            />
          </View>

          <View style={styles.loginRow}>
            <TextInput
              autoCorrect={false}
              placeholder='email'
              placeholderTextColor='#D0DCAD'
              style={styles.loginInput}
              onChangeText={(text) => this.setState({input: text})}
            />
          </View>

          <View style={styles.loginRow}>
            <TextInput
              autoCorrect={false}
              password={true}
              placeholder='•••••••'
              placeholderTextColor='#D0DCAD'
              style={styles.loginInput}
              onChangeText={(text) => this.setState({input: text})}
            />
          </View>

          <View style={styles.loginRow}>
            <TouchableHighlight 
              style={styles.loginButton}
              activeOpacity={80}
              underlayColor="#edeeee">
              <Text style={styles.loginButtonText}>
                Register
              </Text>
            </TouchableHighlight>
          </View>

        </View>
      </View>);
  }

});

module.exports = RegisterView;

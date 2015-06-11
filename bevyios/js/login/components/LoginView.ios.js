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
var Button = require('react-native-button');
var backgroundImage = require('image!backgroundImage');


var styles = StyleSheet.create({
  loginConatiner: {
    flexDirection: 'column',
    padding: 10,
    justifyContent: 'center',
    backgroundColor: '#edeeee',
  },
  loginRow: {
    flexDirection: 'row',
    padding: 6,
    justifyContent: 'center'
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
  loginButtonText: {
    textAlign: 'center',
    color: 'white',
  },

  // background CSS
  loginBackground: {
    flex: 1,
    resizeMode: 'cover',
  }
})

var LoginView = React.createClass({

  render: function() {
    return ( 
      <View style={styles.loginContainer}>

        
        <Image source={backgroundImage} style={styles.loginBackground} />

        <View style={styles.loginRow}>
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
              login nig
            </Text>
          </TouchableHighlight>
        </View>
      </View>);
  }

});

module.exports = LoginView;

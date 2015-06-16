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
    marginTop: 130
  },
  loginRow: {
    flexDirection: 'row',
    padding: 6,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0)'
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
    fontSize: 10,
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
  loginButtonText: {
    textAlign: 'center',
    color: 'black',
  },
  backgroundWrapper: {
    position: 'absolute',
    top: -100,
  },
  imageButton: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 30,
    padding: 10
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
              underlayColor='rgba(0,0,0,0)'
            >
              <Text style={styles.loginSubTitle}>
                your picture here
              </Text>
            </TouchableHighlight>
          </View>

          <View style={styles.loginRow}>
            <TextInput
              autoCorrect={false}
              placeholder='email'
              placeholderTextColor='rgba(255,255,255,.6)'
              style={styles.loginInput}
              onChangeText={(text) => this.setState({input: text})}
            />
          </View>

          <View style={styles.loginRow}>
            <TextInput
              autoCorrect={false}
              password={true}
              placeholder='•••••••'
              placeholderTextColor='rgba(255,255,255,.6)'
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

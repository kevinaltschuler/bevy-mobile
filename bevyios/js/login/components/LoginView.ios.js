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

// modules
var backgroundImage = require('image!loginBackground');
var bevy_logo_trans = require('image!bevy_logo_trans');
var RegisterView = require('./RegisterView.ios.js');
var ForgotPass = require('./ForgotPass.ios.js');
var BevyListButton = require('./../../BevyList/components/BevyListButton.ios.js')

var Button = require('react-native-button');
var _ = require('underscore');
var api = require('./../../utils/api.js')

var LoginView = React.createClass({
  getInitialState: function(){
    return {
      email: '',
      pass: '',
      error: ''
    };
  },

  toRegister: function() {
    this.props.toRoute({
      name: "",
      component: RegisterView
    });
  },

  toForgotPass: function() {
    this.props.toRoute({
      name: "",
      component: ForgotPass
    });
  },

  handleSubmit: function() {
      api.auth(this.state.email, this.state.pass)
      .then((res) => {
        if(res.object == undefined) {
          this.setState({
            user:res
          });
         
         // go to posts
         //this.toPostView();
         
        } else {
            this.setState({error: res.message});
        }
        
      });

      //console.log(this.state.user);

  },

  render: function() {
    return ( <View>

          <View style={styles.backgroundWrapper}>
            <Image source={backgroundImage} style={styles.loginBackground}/>
          </View>
        <View style={styles.loginContainer}>

          <View style={styles.loginRowLogo}>
            <Image
              style={styles.logo}
              source={bevy_logo_trans}
            />
          </View>


          <View style={styles.loginRow}>
            <Text style={styles.loginTitle}>
              Bevy
            </Text>
          </View>

          <View style={styles.loginRowText}>
            <Text style={styles.loginSubTitle}>
              {this.state.error}
            </Text>
          </View>

          <View style={styles.loginRow}>
            <TextInput
              autoCorrect={false}
              placeholder='email'
              style={styles.loginInput}
              onChangeText={(text) => this.setState({email: text})}
              placeholderTextColor='rgba(255,255,255,.6)'
            />
          </View>

          <View style={styles.loginRow}>
            <TextInput
              autoCorrect={false}
              password={true}
              placeholder='•••••••'
              style={styles.loginInput}
              onChangeText={(text) => this.setState({pass: text})}
              placeholderTextColor='rgba(255,255,255,.6)'
            />
          </View>

          <View style={styles.loginRow}>
            <TouchableHighlight 
              style={styles.loginButton}
              activeOpacity={80}
              underlayColor="#edeeee"
              onPress={this.handleSubmit}>
              <Text style={styles.loginButtonText}>
                login
              </Text>
            </TouchableHighlight>
          </View>

          <View style={styles.loginRow}>
            <TouchableHighlight 
              style={styles.loginButtonGoogle}
              activeOpacity={80}
              underlayColor="#CB442E">
              <Text style={styles.loginButtonTextGoogle}>
                login with google
              </Text>
            </TouchableHighlight>
          </View>

          <View style={styles.loginRow}>
            <TouchableHighlight 
              activeOpacity={20}
              onPress={this.toForgotPass}
              underlayColor='rgba(0,0,0,0)'
            >
              <Text style={styles.loginSubTitle}>
                lost password
              </Text>
            </TouchableHighlight>

            <Text style={styles.loginSubTitle}>
              &nbsp; | &nbsp;
            </Text>

            <TouchableHighlight 
              activeOpacity={80}
              onPress={this.toRegister}
              underlayColor='rgba(0,0,0,0)'
            >
              <Text style={styles.loginSubTitle}>
                register
              </Text>
            </TouchableHighlight>
          </View>

        </View>
        </View>);
  }

});

var styles = StyleSheet.create({
  loginContainer: {
    backgroundColor: 'rgba(0,0,0,0)',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    marginTop: 80
  },
  loginRow: {
    flexDirection: 'row',
    padding: 6,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  loginRowLogo: {
    flexDirection: 'row',
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
  backgroundWrapper: {
    position: 'absolute',
    top: -100,

  },
  logo: {
    width: 50,
    height: 50,
  },
})

module.exports = LoginView;
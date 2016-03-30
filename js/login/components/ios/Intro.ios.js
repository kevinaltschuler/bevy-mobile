/**
 * Intro.ios.js
 *
 * an intro to the app,
 * goes to login
 *
 * @author  kevin
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} = React;

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');

var Intro = React.createClass({
  propTypes: {
    loginNavigator: React.PropTypes.object,
    message: React.PropTypes.string
  },

  navToLogin() {
  	this.props.loginNavigator.push({ name: routes.LOGIN.SLUG });
  },

  render() {
    return (
    	<View style={ styles.container }>
      	<Image
          style={ styles.logo }
          source={ require('./../../../images/logo_100_reversed.png') }
        />
        <View style={ styles.title }>
          <Text style={ styles.titleText }>
            Bevy
          </Text>
          <Text style={ styles.detailText }>
            The Community App
          </Text>
        </View>
        <TouchableOpacity
        	activeOpacity={ 0.5 }
        	style={ styles.loginButton }
        	onPress={ this.navToLogin }
        >
      		<Text style={ styles.loginButtonText }>
      			Login to Your Team
      		</Text>
        </TouchableOpacity>
	    </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    width: constants.width,
    backgroundColor: '#2cb673',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: constants.width / 5,
    paddingBottom: 5,
    height: constants.height
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
    marginVertical: 30
  },
  title: {
    alignItems: 'center',
    marginBottom: 10,
    marginVertical: 30,
    flex: 2
  },
  titleText: {
    fontSize: 32,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  detailText: {
  	marginTop: 30,
    fontSize: 18,
    color: '#fff',
    textAlign: 'center'
  },
  loginButton: {
  	backgroundColor: '#fff',
  	paddingHorizontal: 30,
  	paddingVertical: 10,
  	marginVertical: 30,
  	borderRadius: 5,
  	justifyContent: 'center',
  	alignItems: 'center',
  },
  loginButtonText: {
    color: '#2cb673',
    fontWeight: 'bold',
    fontSize: 20
  }
});

module.exports = Intro;

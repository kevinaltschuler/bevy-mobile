/**
 * Intro.ios.js
 * an intro to the app, 
 * goes to login
 * @author  kevin
 */

'use strict';

var React = require('react-native');
var {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  DeviceEventEmitter,
} = React;

var _ = require('underscore');
var constants = require('./../../../constants');
var Icon = require('react-native-vector-icons/MaterialIcons');
var USER = constants.USER;
var routes = require('./../../../routes');
var AppActions = require('./../../../app/AppActions');
var UserActions = require('./../../../user/UserActions');
var UserStore = require('./../../../user/UserStore');

var Intro = React.createClass({
  propTypes: {
    loginNavigator: React.PropTypes.object,
    message: React.PropTypes.string
  },

  navToLogin() {
  	this.props.loginNavigator.push({
  		name: routes.LOGIN.SLUG
  	});
  },


  render() {
    return (
      <ScrollView
        ref={ ref => { this.ScrollView = ref; }}
        style={styles.container}
        contentContainerStyle={ styles.containerInner }
        keyboardShouldPersistTaps={ true }
        //scrollEnabled={ false }
      >
      	<View style={{
      		flexDirection: 'column',
      		alignItems: 'center'
      	}}>
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
	        <TouchableHighlight
	        	underlayColor={'rgba(255,255,255,.8)'}
	        	style={styles.loginButton}
	        	onPress={this.navToLogin}
	        >
        		<Text style={{color: '#2cb673', fontWeight: 'bold', fontSize: 20}}>
        			Login to Your Team
        		</Text>
	        </TouchableHighlight>
	    </View>
      </ScrollView>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    width: constants.width,
    backgroundColor: '#2cb673'
  },
  containerInner: {
    flexDirection: 'column',
    paddingBottom: 5,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: constants.width / 5
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
    marginVertical: 30
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
    textAlign: 'center',
    maxWidth: 200
  },
  loginButton: {
  	backgroundColor: '#fff',
  	paddingHorizontal: 30,
  	paddingVertical: 10,
  	marginVertical: 30,
  	borderRadius: 5,
  	justifyContent: 'center',
  	alignItems: 'center',
  	marginTop: 300
  }
});

module.exports = Intro;

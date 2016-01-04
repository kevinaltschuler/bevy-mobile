/*
 * loading
 * @author kevin
 * uh yaknow, jays the kinda guy that dont wash his deck, jays the kinda guy that cried during shrek yo
 */

'use strict';

var React = require('react-native');
var constants = require('./../../../constants');
var USER = constants.USER;
var routes = require('./../../../routes');
var UserStore = require('./../../../user/UserStore');
var UserActions = require('./../../../user/UserActions');
var AppActions = require('./../../../app/AppActions');

var {
	Image,
	View,
	AsyncStorage
} = React;

var Loading = React.createClass({

	componentWillMount() {
		// first things first try to load the user
	    console.log('loading...');
	    AsyncStorage.getItem('user')
	    .then((user) => {
	      if(user) {
	        console.log('user fetched');
	        UserActions.loadUser(JSON.parse(user));
	        AppActions.load();
	      } else {
	        console.log('going to login screen...');
	        this.props.mainNavigator.replace(routes.MAIN.LOGIN);
	        AppActions.load();
	      }
	    });
	},

	render() {
		var logoUrl = constants.siteurl + '/img/logo_300_white.png';
		return (
			<View style={{
				height: constants.height, 
				width: constants.width, 
				backgroundColor: '#2cb673', 
				alignItems: 'center', 
				justifyContent: 'center'
			}}>
				<Image style={{width: 60, height: 60}} source={{uri: logoUrl}}/>
			</View>
		)
	}
});

module.exports = Loading;
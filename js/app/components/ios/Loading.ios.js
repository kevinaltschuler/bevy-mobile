/**
 * loading
 * @author kevin
 * uh yaknow, jays the kinda guy that dont wash his deck,
 * jays the kinda guy that cried during shrek yo
 * @flow
 */

'use strict';

var React = require('react-native');
var {
	Image,
	View,
	AsyncStorage
} = React;

var _ = require('underscore');
var constants = require('./../../../constants');
var USER = constants.USER;
var routes = require('./../../../routes');
var UserStore = require('./../../../user/UserStore');
var UserActions = require('./../../../user/UserActions');
var AppActions = require('./../../../app/AppActions');

var Loading = React.createClass({

	componentDidMount() {
		// first things first try to load the user
	    console.log('loading...');
	    AsyncStorage.getItem('user')
	    .then(user => {
	      if(user) {
					console.log('found user. loading user...', user);
	        UserActions.loadUser(JSON.parse(user));
	      } else {
	        console.log('going to login screen...');
	        this.props.mainNavigator.replace({
						name: routes.MAIN.LOGIN
					});
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
				<Image
					style={{
						width: 60,
						height: 60
					}}
					source={{ uri: logoUrl }}
				/>
			</View>
		);
	}
});

module.exports = Loading;

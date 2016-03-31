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
	AsyncStorage,
	StyleSheet
} = React;

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');

var UserStore = require('./../../../user/UserStore');
var UserActions = require('./../../../user/UserActions');
var AppActions = require('./../../../app/AppActions');

var USER = constants.USER;

var Loading = React.createClass({

	componentDidMount() {
		// first things first try to load the user
    console.log('loading...');
    AsyncStorage.getItem('user')
    .then(user => {
      if(user) {
				user = JSON.parse(user);
				if(typeof user === 'string') {
					console.log('weird');
					this.props.mainNavigator.replace({ name: routes.MAIN.LOGIN });
					return;
				}
				console.log('found user. loading user...', user);
        UserActions.loadUser(user);
      } else {
        console.log('going to login screen...');
        this.props.mainNavigator.replace({ name: routes.MAIN.LOGIN });
      }
    });
	},

	render() {
		return (
			<View style={ styles.container }>
				<Image
					style={ styles.logo }
					source={ require('./../../../images/logo_300_white.png') }
				/>
			</View>
		);
	}
});

var styles = StyleSheet.create({
	container: {
		height: constants.height,
		width: constants.width,
		backgroundColor: '#2cb673',
		alignItems: 'center',
		justifyContent: 'center'
	},
	logo: {
		width: 60,
		height: 60
	}
});

module.exports = Loading;

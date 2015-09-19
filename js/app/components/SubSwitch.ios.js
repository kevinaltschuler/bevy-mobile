/** ski shooots
* subswitch.ios.js
*/

'use strict';

var React = require('react-native');
var _ = require('underscore');

var {
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  TouchableHighlight,
  SwitchIOS
} = React;

var constants = require('./../../constants');
var routes = require('./../../routes');
var BevyActions = require('./../../bevy/BevyActions');
var StatusBarSizeIOS = require('react-native-status-bar-size');
var BevyStore = require('./../../bevy/BevyStore');
var UserStore = require('./../../user/UserStore');
var BevyActions = require('./../../bevy/BevyActions');
var BEVY = constants.BEVY;

var SubSwitch = React.createClass({
	propTypes: {
		subbed: React.PropTypes.bool,
		loggedIn: React.PropTypes.bool,
		bevy: React.PropTypes.object,
		user: React.PropTypes.object
	},

	getInitialState() {
		return {
			value: this.props.subbed
		}
	},

	render() {
		var bevy = this.props.bevy;

		return (     
			<SwitchIOS
	          value={this.state.value}
	          onValueChange={(value) => {

	            if(!this.props.loggedIn) {
	              this.props.authModalActions.open('Log In To Subscribe');
	              return;
	            }

	            this.setState({
	            	value: value
	            });
	  
	            if(!this.state.value) {
	              BevyActions.subscribe(bevy._id);
	            } else {
	              BevyActions.unsubscribe(bevy._id);
	            }
	          }}
	        />
       );
	}

});

module.exports = SubSwitch;
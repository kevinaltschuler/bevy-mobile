/* FilterItem.ios.js
*  i have no more gains
*/

'use strict':

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

var FilterItem = React.createClass({
  propTypes: {
    filter: React.PropTypes.object,
    value: React.PropTypes.bool
  },

  getInitialState() {
    return {
      value: this.props.value
    }
  },

  render() {

    return (     
      <SwitchIOS
        value={this.state.value}
        style={styles.switch}
        onValueChange={(value) => {

          if(!this.props.loggedIn) {
            this.props.authModalActions.open('Log In To Filter posts');
            return;
          }

          this.setState({
            value: value
          });

          if(!this.state.value) {
            BevyActions.addFilter(this.props.filter);
          } else {
            BevyActions.removeFilter(this.props.filter);
          }
        }}
      />
    );
  }

});

var styles = StyleSheet.create({
  switch: {
    
  }
});
module.exports = FilterItem;
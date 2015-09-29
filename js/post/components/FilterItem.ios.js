/* FilterItem.ios.js
*  i have no more gains
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

var FilterItem = React.createClass({
  propTypes: {
    filter: React.PropTypes.object,
    value: React.PropTypes.bool,
    isFrontpage: React.PropTypes.bool,
    frontpageFilters: React.PropTypes.array,
    source: React.PropTypes.array,
    myBevies: React.PropTypes.array
  },

  getInitialState() {
    return {
      value: this.props.value
    }
  },

  render() {

    return (
	    <View style={styles.container}>     
	      <SwitchIOS
	        value={this.state.value}
	        style={styles.switch}
	        onValueChange={(value) => {

	          this.setState({
	            value: value
	          });

            var filters = this.props.source;

	          if(!this.state.value) {
              filters.push(this.props.filter);
	          } else {
              filters = _.reject(filters, function($filter){ $filter == this.props.filter });
              //removing
	          }

            if(this.props.isFrontpage) 
              BevyActions.updateFilters(filters);
            else 
              BevyActions.updateTags(filters);
	        }}
	      />
	      <Text style={ styles.label }>
	      	{this.props.filter.name}
	      </Text>
	    </View>

    );
  }

});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 15
  },
  label: {
    marginLeft: 10
  }
});
module.exports = FilterItem;
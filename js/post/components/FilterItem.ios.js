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

var Icon = require('react-native-vector-icons/Ionicons');

var FilterItem = React.createClass({
  propTypes: {
    filter: React.PropTypes.object,
    value: React.PropTypes.bool,
    isFrontpage: React.PropTypes.bool,
    frontpageFilters: React.PropTypes.array,
    activeTags: React.PropTypes.array,
    source: React.PropTypes.array,
    myBevies: React.PropTypes.array
  },

  getInitialState() {
    return {
      value: this.props.value,
      filter: this.props.filter
    }
  },

  render() {

    var color = (this.props.isFrontpage)
    ? '#333'
    : this.props.filter.color;

    var icon = (this.state.value)
    ? <Icon
        name='ios-checkmark'
        size={ 30 }
        style={{ width: 30, height: 30 }}
        color={color}
      />
    : <Icon
        name='ios-circle-outline'
        size={ 30 }
        style={{ width: 30, height: 30 }}
        color={color}
      />;
    return (
	    <View style={styles.container}>     
	      <SwitchIOS
	        value={this.state.value}
	        style={styles.switch}
	        onValueChange={(value) => {

	          this.setState({
	            value: value
	          });

            if(this.props.isFrontpage) {
              // if filtering by bevy
              // this.props.filter = a bevy object & 
              // this.props.source = array of myBevies
              /*var filters = _.pluck(this.props.source, '_id');
              var filters = _.filter(filters, function(filter){
                return _.contains(this.props.frontpageFilters, filter);
              }.bind(this));*/
              var filters = this.props.frontpageFilters;
              console.log(filters);

              if(!this.state.value) 
                filters.push(this.state.filter._id);
              else 
                filters = _.reject(filters, function($filter){ return $filter == this.state.filter._id }.bind(this));

              BevyActions.updateFront(filters); 
            }
            else {
              //this.props.source is a list of tag objects
              //this.state.filter is a tag object
              var filters = this.props.activeTags;

              if(!this.state.value) 
                filters.push(this.state.filter);
              else 
                filters = _.reject(filters, function($filter){ return $filter == this.state.filter }.bind(this));

              BevyActions.updateTags(filters);
            } 
	        }}
	      />
	      <Text style={ styles.label }>
	      	{this.state.filter.name}
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
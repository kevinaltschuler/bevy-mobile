/**
 * Map.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  MapView,
  TouchableNativeFeedback,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');

var _ = require('underscore');

var $Map = React.createClass({
  propTypes: {
    location: React.PropTypes.string,
    mainNavigator: React.PropTypes.object,
    mainRoute: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      location: ''
    };
  },

  getInitialState() {
    return {
    };
  },

  componentDidMount() {
    this.getCoordinates();
  },
  componentWillUnmount() {

  },

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if(this.props.location !== nextProps.location) {
      // different location passed in. get new coordinates
      this.getCoordinates(); 
    }
  },

  getCoordinates() {
    // query google for the latitude and longitude
    fetch(
      'http://maps.googleapis.com/maps/api/geocode/json?address=' 
      + encodeURIComponent(this.props.location),
      {
        method: 'GET',
        headers: {},
      })
    .then(res => res.json())
    .then(res => {
      data = res;
      var coords = {};
      var results = data.results;
      if(_.isEmpty(results)) return;
      var geometry = results[0].geometry;
      if(_.isEmpty(geometry) || _.isEmpty(geometry.location)) return;
      this.setState({
        result: results[0],
        latitude: geometry.location.lat,
        longitude: geometry.location.lng,
        latitudeDelta: Math.abs(geometry.viewport.northeast.lat
          - geometry.viewport.southwest.lat),
        longitudeDelta: Math.abs(geometry.viewport.northeast.lng
          - geometry.viewport.southwest.lng)
      });
    });
  },

  goBack() {
    this.props.mainNavigator.pop();
  },

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.topBar }>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#DDD', false) }
            onPress={ this.goBack }
          >
            <View style={ styles.backButton }>
              <Icon
                name='arrow-back'
                size={ 30 }
                color='#333'
              />
            </View>
          </TouchableNativeFeedback>
        </View>
        <Text>MAP VIEW { this.props.location }</Text>
        <MapView
          annotations={[{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            animateDrop: true,
            title: this.props.location
          }]}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: this.state.latitudeDelta,
            longitudeDelta: this.state.longitudeDelta
          }}
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {

  }
});

module.exports = $Map;
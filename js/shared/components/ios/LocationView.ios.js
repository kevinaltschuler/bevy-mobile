/**
 * MapView.ios.js
 * @author kevin
 * @flow
*/

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  WebView,
  TouchableHighlight
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');

var LocationView = React.createClass({
	getInitialState() {
		return {
			mapRegion: this.props.location
		};
	},

  goBack() {
    this.props.mainNavigator.pop();
  },

	render() {
		return (
			<View style={styles.container}>
        <View style={ styles.topBarContainer }>
          <View style={{
            height: constants.getStatusBarHeight(),
            backgroundColor: '#2CB673'
          }}/>
          <View style={ styles.topBar }>
            <TouchableHighlight
              underlayColor='rgba(0,0,0,0.1)'
              style={ styles.iconButton }
              onPress={ this.goBack }
            >
              <Icon
                name='arrow-back'
                size={ 30 }
                color='#FFF'
              />
            </TouchableHighlight>
            <Text style={ styles.title }>
              { this.props.location }
            </Text>
            <View style={{
              width: 48,
              height: 48
            }}/>
          </View>
        </View>
        <WebView
        	style={ styles.map }
        	url={ 'https://www.google.com/maps/search/'
            + this.props.location.replace(/ /g, '+') }
        	scrollEnabled={ false }
        	scalePageToFit={ true }
        	contentInset={{
            top: -20,
            left: 0,
            bottom: 0,
            right: 0
          }}
        />
			</View>
		);
	}
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#eee'
  },
  topBarContainer: {
    flexDirection: 'column',
    paddingTop: 0,
    overflow: 'visible',
    backgroundColor: '#2CB673',
  },
  topBar: {
    height: 48,
    backgroundColor: '#2CB673',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 17,
    textAlign: 'center',
    color: '#FFF'
  },
  iconButton: {
    width: 48,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  map: {
  	flex: 1,
  	height: 500
  }
});

module.exports = LocationView;

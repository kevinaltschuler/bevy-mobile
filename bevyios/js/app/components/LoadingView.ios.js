'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  AsyncStorage
} = React;

var bevy_logo_trans = require('image!bevy_logo_trans');
var api = require('./../../utils/api.js');
var constants = require('./../../constants.js');

var AppActions = require('./../AppActions');

var LoadingView = React.createClass({

  propTypes: {
    router: React.PropTypes.object,
    navigator: React.PropTypes.object
  },

  getInitialState: function() {

    console.log('loading...');
    AsyncStorage.getItem('user')
    .then((user) => {
      if(user) {
        constants.setUser(JSON.parse(user));
        AppActions.load();
        //this.props.navigator.push({ name: 'MainTabBar', index: 2});
      } else {
        console.log('going to login screen...');
        //this.props.navigator.push({ name: 'LoginNavigator', index: 1});
      }
    });

    return {};
  },

  render: function() {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingRowLogo}>
          <Image
            style={styles.logo}
            source={bevy_logo_trans}
          />
        </View>
        <View style={styles.loadingRow}>
          <Text style={styles.loadingTitle}>
            Bevy
          </Text>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#2CB673',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: 135
  },
  loadingRowLogo: {
    flexDirection: 'row',
    padding: 6,
    justifyContent: 'center'
  },
  logo: {
    width: 50,
    height: 50
  },
  loadingRow: {
    flexDirection: 'row',
    padding: 6,
    justifyContent: 'center'
  },
  loadingTitle: {
    textAlign: 'center',
    fontSize: 30,
    color: 'white'
  }
});

module.exports = LoadingView;
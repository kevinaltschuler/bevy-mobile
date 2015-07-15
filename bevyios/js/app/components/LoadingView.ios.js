'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image
} = React;

var bevy_logo_trans = require('image!bevy_logo_trans');

var LoadingView = React.createClass({

  propTypes: {
    router: React.PropTypes.object,
    navigator: React.PropTypes.object
  },

  getInitialState: function() {

    return { };
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
  },
  loadingInfo: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    color: 'white'
  }
});

module.exports = LoadingView;
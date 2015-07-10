'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  AsyncStorage
} = React;
var ProgressBar = require('react-native-progress-bar');

var bevy_logo_trans = require('image!bevy_logo_trans');
var api = require('./../../utils/api.js');
var constants = require('./../../constants.js');
var APP = constants.APP;

var AppActions = require('./../AppActions');

var BevyStore = require('./../../BevyView/BevyStore');
var ChatStore = require('./../../ChatView/ChatStore');
var PostStore = require('./../../PostList/PostStore');

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
        this.setState({
          progress: this.state.progress + 0.1
        });
        AppActions.load();
        //this.props.navigator.push({ name: 'MainTabBar', index: 2});
      } else {
        console.log('going to login screen...');
        this.props.navigator.push({ name: 'LoginNavigator', index: 1});
      }
    });

    return {
      progress: 0,
      progressText: 'Loading...'
    };
  },

  componentDidMount: function() {
    BevyStore.on(APP.LOAD_PROGRESS, this._handleProgress);
    ChatStore.on(APP.LOAD_PROGRESS, this._handleProgress);
    PostStore.on(APP.LOAD_PROGRESS, this._handleProgress);
  },

  componentWillUnmount: function() {
    BevyStore.off(APP.LOAD_PROGRESS, this._handleProgress);
    ChatStore.off(APP.LOAD_PROGRESS, this._handleProgress);
    PostStore.off(APP.LOAD_PROGRESS, this._handleProgress);
  },

  _handleProgress: function(progress, message) {
    this.setState({
      progress: this.state.progress + progress,
      progressText: message || this.state.progressText
    });
    if(this.state.progress >= 1) {
      setTimeout(function() {
        this.props.navigator.push({ name: 'MainTabBar', index: 2});
      }.bind(this), 1000);
    }
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
        <View style={ styles.loadingRow }>
          <ProgressBar
            fillStyle={{ backgroundColor: '#fff' }}
            backgroundStyle={{ backgroundColor: '#ccc'}}
            style={{ marginTop: 30, width: 300 }}
            progress={ this.state.progress }
          />
        </View>
        <View style={ styles.loadingRow }>
          <Text style={ styles.loadingInfo }>
            { this.state.progressText }
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
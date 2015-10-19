/**
 * BevyList.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  ListView,
  View,
  Text,
  StyleSheet,
  ProgressBarAndroid
} = React;
var BevyListItem = require('./BevyListItem.android.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var BEVY = constants.BEVY;
var BevyStore = require('./../../BevyStore');

var BevyList = React.createClass({
  propTypes: {
    drawerActions: React.PropTypes.object,
    publicBevies: React.PropTypes.array,
    myBevies: React.PropTypes.array,
    activeBevy: React.PropTypes.object,
    loggedIn: React.PropTypes.bool
  },

  getInitialState() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var bevies = (this.props.loggedIn) 
      ? this.props.myBevies 
      : this.props.publicBevies;
    return {
      ds: ds.cloneWithRows(bevies),
      bevies: bevies,
      loading: true // set to loading by default
    };
  },

  componentDidMount() {
    BevyStore.on(BEVY.LOADING, this._onBevyLoading);
    BevyStore.on(BEVY.LOADED, this._onBevyLoaded);
  },
  componentWillUnmount() {
    BevyStore.off(BEVY.LOADING, this._onBevyLoading);
    BevyStore.off(BEVY.LOADED, this._onBevyLoaded);
  },

  componentWillReceiveProps(nextProps) {
    var bevies = (nextProps.loggedIn) 
      ? nextProps.myBevies 
      : nextProps.publicBevies;
    this.setState({
      bevies: bevies,
      ds: this.state.ds.cloneWithRows(bevies)
    });
  },

  _onBevyLoading() {
    this.setState({
      loading: true
    });
  },

  _onBevyLoaded() {
    this.setState({
      loading: false
    });
  },

  render() {
    if(this.state.loading) {
      return (
        <ProgressBarAndroid />
      );
    } else if (_.isEmpty(this.state.bevies)) {
      return (
        <Text style={ styles.noBevies }>No Bevies</Text>
      );
    }
    return (
      <ListView 
        dataSource={ this.state.ds }
        style={ styles.container }
        renderRow={(bevy) => {
          return (
            <BevyListItem
              key={ 'bevylistitem:' + bevy._id }
              bevy={ bevy }
              activeBevy={ this.props.activeBevy }
              drawerActions={ this.props.drawerActions }
            />
          );
        }}
      />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  noBevies: {
    
  }
});

module.exports = BevyList;
/**
 * BevyPickerView.ios.js
 * @author albert
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  ListView,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var BevyPickerItem = require('./BevyPickerItem.ios.js');

var _ = require('underscore');
var routes = require('./../../../routes');
var constants = require('./../../../constants');
var resizeImage = require('./../../../shared/helpers/resizeImage');
var StatusBarSizeIOS = require('react-native-status-bar-size');

var BevyPickerView = React.createClass({
  propTypes: {
    onSwitchBevy: React.PropTypes.func,
    selected: React.PropTypes.object
  },

  getInitialState() {
    var bevies = this.props.myBevies;
    return {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(bevies),
      selected: this.props.selected
    };
  },

  componentWillReceiveProps(nextProps) {
    var bevies = nextProps.myBevies;
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(bevies),
      selected: nextProps.selected
    });
  },

  onSwitchBevy(bevy) {
    this.setState({
      selected: bevy
    });
  },

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.topBarContainer }>
          <View style={{
            height: StatusBarSizeIOS.currentHeight,
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
              Posting To...
            </Text>
            <View style={{
              width: 48,
              height: 48
            }}/>
          </View>
        </View>
        <ListView
          dataSource={ this.state.dataSource }
          style={ styles.bevyPickerList }
          renderRow={(bevy) => {
            return (
              <BevyPickerItem
                key={ 'bevypickeritem:' + bevy._id }
                bevy={ bevy }
                onSwitchBevy={ this.onSwitchBevy }
              />
            );
          }}
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
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
  bevyPickerList: {
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'column'
  }
});

module.exports = BevyPickerView;

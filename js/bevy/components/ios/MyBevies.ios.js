/**
 * MyBevies.ios.js
 * @author kevin
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var BevyCard = require('./BevyCard.ios.js');
var RefreshingIndicator = require('./../../../shared/components/ios/RefreshingIndicator.ios.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var StatusBarSizeIOS = require('react-native-status-bar-size');
var UserStore = require('./../../../user/UserStore');
var BEVY = constants.BEVY;

var MyBevies = React.createClass({
  propTypes: {
    myBevies: React.PropTypes.array,
    activeBevy: React.PropTypes.object,
    user: React.PropTypes.object,
    loggedIn: React.PropTypes.bool,
    mainNavigator: React.PropTypes.object
  },

  changeBevy(rowData) {

  },

  goToNewBevy() {
    this.props.mainNavigator.push(routes.MAIN.NEWBEVY);
  },

  _renderBevyList() {
    var bevies = (this.props.loggedIn)
    ? _.filter(this.props.myBevies, function(bevy) { return bevy.parent == null })
    : this.props.publicBevies;

    var bevyList = [];

    for(var key in bevies) {
      var bevy = bevies[key];
      bevyList.push(
        <BevyCard
          bevy={ bevy }
          bevyNavigator={ this.props.bevyNavigator }
          key={ 'bevylist:' + bevy._id }
          mainNavigator={ this.props.mainNavigator }
        />
      );
    }
    return bevyList;
  },

  _renderNewBevyCard() {
    return (
      <TouchableHighlight
        underlayColor='rgba(0,0,0,.1)'
        onPress={ this.goToNewBevy }
        style={ styles.newBevyCard }
      >
        <View
          style={{
            alignItems: 'center'
          }}
        >
          <Icon
            name='add'
            size={ 60 }
            color='#aaa'
          />
          <Text
            style={{
              color: '#999',
              fontSize: 17
            }}
          >
            Create a New Bevy
          </Text>
        </View>
      </TouchableHighlight>
    );
  },

  render: function() {
    return (
      <View style={ styles.container }>
        <View style={ styles.topBarContainer }>
          <View style={{
            height: StatusBarSizeIOS.currentHeight,
            backgroundColor: '#2CB673'
          }}/>
          <View style={ styles.topBar }>
            <View style={{
              width: 48,
              height: 48
            }}/>
            <Text style={ styles.title }>
              My Bevies
            </Text>
            <TouchableHighlight
              underlayColor='rgba(0,0,0,0.1)'
              style={ styles.iconButton }
              onPress={ this.goToNewBevy }
            >
              <Icon
                name='add'
                size={ 30 }
                color='#FFF'
              />
            </TouchableHighlight>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={ styles.bevyList }
          automaticallyAdjustContentInsets={ false }
          showsVerticalScrollIndicator={ true }
        >
          { this._renderBevyList() }
          { this._renderNewBevyCard() }
        </ScrollView>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 0,
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
  bevyList: {
    flexDirection: 'column',
    width: constants.width,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10,
    paddingTop: 10,
  },
  newBevyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    width: constants.width * .88,
    height: 160,
    borderColor: '#aaa',
    borderWidth: 3,
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 70
  }
});

module.exports = MyBevies;

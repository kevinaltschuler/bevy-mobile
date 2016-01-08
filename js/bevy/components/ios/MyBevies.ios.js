/**
 * MyBevies.js
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var PostList = require('./../../../post/components/ios/PostList.ios.js');
var AddBevyModal = require('./AddBevyModal.ios.js');
var BevyCard = require('./BevyCard.ios.js');
var Navbar = require('./../../../shared/components/ios/Navbar.ios.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var BevyActions = require('./../../../bevy/BevyActions');
var UserActions = require('./../../../user/UserActions');
var FileActions = require('./../../../file/FileActions');
var StatusBarSizeIOS = require('react-native-status-bar-size');
var BEVY = constants.BEVY;

var MyBevies = React.createClass({
  propTypes: {
    myBevies: React.PropTypes.array,
    activeBevy: React.PropTypes.object,
    user: React.PropTypes.object,
    loggedIn: React.PropTypes.bool,
    mainNavigator: React.PropTypes.object
  },

  getInitialState() {
    return {
      showAddBevyModal: false
    };
  },

  onHideModal() {
    this.setState({
      showAddBevyModal: false
    })
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
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: constants.width / 1.3,
          height: 160,
          borderColor: '#aaa',
          borderWidth: 3,
          borderRadius: 5,
          overflow: 'hidden',
          marginVertical: 10
        }}
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
              color: '#999'
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
              style={ styles.plusButton }
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
    backgroundColor: '#2CB673'
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
  plusButton: {
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
    marginBottom: 10
  },
});

module.exports = MyBevies;

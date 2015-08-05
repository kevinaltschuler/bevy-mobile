/**
 * BevyList.js
 * kevin made this
 * the yung sauce villain
 */
'use strict';

var React = require('react-native');
var window = require('Dimensions').get('window');
var _ = require('underscore');
var {
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  TouchableHighlight
} = React;
var {
  Icon
} = require('react-native-icons');

var PostList = require('./../../post/components/PostList.ios.js');
var Accordion = require('react-native-accordion');

var StatusBarSizeIOS = require('react-native-status-bar-size');
var constants = require('./../../constants');
var routes = require('./../../routes');
var BevyActions = require('./../BevyActions');
var BEVY = constants.BEVY;

var BevyList = React.createClass({
  propTypes: {
    myBevies: React.PropTypes.array,
    activeBevy: React.PropTypes.object,
    menuActions: React.PropTypes.object,
    user: React.PropTypes.object,
    loggedIn: React.PropTypes.bool
  },

  getInitialState() {
    return {
      profileAccordionOpen: false
    };
  },

  componentWillReceiveProps(nextProps) {
    if(!nextProps.loggedIn) {
    }
  },

  changeBevy: function(rowData) {

  },

  _renderPublicHeader() {
    return (
      <Text style={ styles.publicHeader }>
        { (this.props.loggedIn) ? 'My Bevies' : 'Public Bevies' }
      </Text>
    );
  },

  _renderBevyBar() {
    return (
      <View style={ styles.activeBevy }>
        <Text style={ styles.activeBevyText }>
          { this.props.activeBevy.name }
        </Text>
      </View>
    );
  },

  _renderBevyList() {
    var bevies = (this.props.loggedIn)
    ? _.filter(this.props.myBevies, function(bevy) { return bevy.parent == null })
    : this.props.publicBevies;

    if(!this.props.loggedIn) {
      bevies.unshift({
        _id: '-1',
        name: 'Frontpage'
      });
    }

    return (
      <View style={ styles.bevyList }>
        { _.map(bevies, function(bevy) {
          var active = (bevy._id == this.props.activeBevy._id);

          return (
            <TouchableHighlight 
              key={ 'bevylist:' + bevy._id }
              style={ (active) ? styles.bevyItemActive : styles.bevyItem }
              onPress={() => {
                if(active) return;
                BevyActions.switchBevy(bevy._id);
                // close the side menu
                //this.props.menuActions.close();
              }}
            >
              <Text style={ (active) ? styles.bevyItemActiveText : styles.bevyItemText }>
                { bevy.name }
              </Text>
            </TouchableHighlight>
          );
        }.bind(this)) }

        { this._renderNewBevyButton() }
      </View>
    );
  },

  _renderNewBevyButton() {
    //if(!this.props.loggedIn) return null;
    return (
      <TouchableHighlight
        style={ styles.bevyAddItem }
        onPress={() => {
          if(!this.props.loggedIn) {
            this.props.authModalActions.open('Log In To Create A Bevy');
            return;
          }
          this.props.mainNavigator.push(routes.MAIN.NEWBEVY);
        }}
      >
        <View style={ styles.bevyAdd }>
          <Text style={ styles.bevyItemText }>
            Create new Bevy
          </Text>
          <Icon
            name='ion|plus-round'
            size={20}
            color='#fff'
            style={{
              alignSelf: 'flex-end', 
              width: 20, 
              height: 20
            }}
          />
        </View>
      </TouchableHighlight>
    );
  },

  
  render: function() {
    return (
      <View style={styles.container}>

        <View style={{
          height: StatusBarSizeIOS.currentHeight
        }} />

        <Accordion
          underlayColor='#333'
          onPress={() => {
            this.setState({
              profileAccordionOpen: !this.state.profileAccordionOpen
            });
          }}
          header={
            <View style={{
              flexDirection: 'row',
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: '#333'
            }}>
              <Image 
                source={{ uri: this.props.user.image_url }}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  marginRight: 10
                }}
              />
              <View style={{
                flex: 1,
                flexDirection: 'column'
              }}>
                <Text style={{ color: '#fff', fontSize: 15 }}>{ this.props.user.displayName }</Text>
                <Text style={{ color: '#eee', fontSize: 12 }}>{ this.props.user.email }</Text>
              </View>
              <Icon
                name={(this.state.profileAccordionOpen) ? 'ion|ios-arrow-down' : 'ion|ios-arrow-right'}
                color='#fff'
                size={ 30 }
                style={{
                  width: 30,
                  height: 30
                }}
              />
            </View>
          }
          content={
            <View style={{
              flexDirection: 'column'
            }}>
              <TouchableHighlight
                underlayColor='#333'
                style={{
                  backgroundColor: '#222',
                  flex: 1,
                  padding: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: '#333'
                }}
                onPress={() => {

                }}
              >
                <Text style={{ color: '#fff', fontSize: 15 }}>Sign Out</Text>
              </TouchableHighlight>
            </View>
          }
        />

        { this._renderPublicHeader() }

        { this._renderBevyList() }

      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 3,
    width: constants.sideMenuWidth,
    height: window.height,
    backgroundColor: '#111',
  },

  publicHeader: {
    fontSize: 15,
    color: '#999',
    paddingLeft: 10,
    marginBottom: 10,
    marginTop: 10
  },

  bevyList: {
    flex: 1
  },
  bevyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  bevyItemActive: {
    backgroundColor: '#222',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  bevyItemText: {
    flex: 1,
    color: '#ddd',
    fontSize: 15
  },
  bevyItemActiveText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 15,
    color: '#fff'
  },

  bevyAddItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#333'
  },
  bevyAdd: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  }
});

module.exports = BevyList;

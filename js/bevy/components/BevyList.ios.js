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
    loggedIn: React.PropTypes.bool
  },

  getInitialState() {
    return {
      activeBevyHeaderOpen: false
    };
  },

  componentWillReceiveProps(nextProps) {
    if(!nextProps.loggedIn) {
      //this.refs.activeBevy.open();
      //this.setState({
      //  activeBevyHeaderOpen: true
      //});
    }
  },

  changeBevy: function(rowData) {

  },

  _renderPublicHeader() {
    if(this.props.loggedIn) return null;
    return (
      <Text style={ styles.publicHeader }>Public Bevies</Text>
    );
  },

  _renderBevyBar() {
    return (
      <View style={ styles.activeBevy }>
        <Text style={ styles.activeBevyText }>
          { this.props.activeBevy.name }
        </Text>
        {/* TODO: @kevin CSS animate this chevron? */}
        <Icon
          name={(this.state.activeBevyHeaderOpen) ? 'ion|chevron-down' : 'ion|chevron-right'}
          size={ 25 }
          color='#fff'
          style={ styles.activeBevyChevron }
        />
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
          // dont render active bevy
          if(bevy._id == this.props.activeBevy._id) return null;

          return (
            <TouchableHighlight 
              key={ 'bevylist:' + bevy._id }
              style={styles.bevyItem}
              onPress={() => {
                BevyActions.switchBevy(bevy._id);
                // close the accordion
                this.refs.activeBevy.close();
                this.setState({
                  activeBevyHeaderOpen: false
                });
                // close the side menu
                this.props.menuActions.close();
              }}
            >
              <Text style={styles.bevyItemText}>
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
            style={ styles.bevyAddIcon }
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

        { this._renderPublicHeader() }

        <Accordion
          ref='activeBevy'
          onPress={() => {
            //console.log('pressed');
            this.setState({
              activeBevyHeaderOpen: !this.state.activeBevyHeaderOpen
            });
          }}
          header={ this._renderBevyBar() }
          content={ this._renderBevyList() }
        />

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
    backgroundColor: 'rgba(29,30,26,1)',
  },

  publicHeader: {
    fontSize: 15,
    color: '#fff',
    paddingLeft: 10,
    marginBottom: 10,
    marginTop: 5
  },

  activeBevy: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  },
  activeBevyText: {
    flex: 1,
    textAlign: 'left',
    fontSize: 17,
    color: '#fff'
  },
  activeBevyChevron: {
    width: 25,
    height: 25
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
    backgroundColor: '#444'
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
  },
  bevyAddIcon: {
    alignSelf: 'flex-end', 
    width: 20, 
    height: 20
  },
  bevyItemText: {
    flex: 1,
    color: '#fff'
  },

  subBevies: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  },
  subBeviesTitle: {
    flex: 1,
    textAlign: 'left',
    fontSize: 17,
    color: '#fff'
  },
  subBeviesAdd: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
    paddingLeft: 10,
    paddingRight: 10
  },
  subBeviesAddIcon: {
    width: 25,
    height: 25
  },
  subBevyList: {
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  },

  title: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  listContainer: {
    flex: 1
  },
  rowContainer: {
    padding: 10,
  },
  whiteText: {
    color: 'white'
  }
});

module.exports = BevyList;

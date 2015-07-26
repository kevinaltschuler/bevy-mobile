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
    subBevies: React.PropTypes.array,
    activeBevy: React.PropTypes.object,
    activeSuper: React.PropTypes.object,
    activeSub: React.PropTypes.object,
    menuActions: React.PropTypes.object
  },

  getInitialState() {

    // get parent bevies
    var bevies = _.filter(this.props.myBevies, function(bevy) {
      return bevy.parent == null;
    });

    return {
      bevies: bevies,
      activeBevyHeaderOpen: false
    };
  },

  componentWillReceiveProps(nextProps) {

    // get parent bevies
    var bevies = _.filter(nextProps.myBevies, function(bevy) {
      return bevy.parent == null;
    });

    this.setState({
      bevies: bevies
    });
  },

  changeBevy: function(rowData) {

  },

  _renderSubBevyBar() {
    if(this.props.activeSuper._id == -1) {
      // dont render subbevybar for the frontpage
      return <View />;
    } 

    return (
      <View style={ styles.subBevies }>
        <Text style={ styles.subBeviesTitle }>
          Subbevies
        </Text>
        <TouchableHighlight
          style={ styles.subBeviesAdd }
          onPress={() => {
            this.props.mainNavigator.jumpTo(routes.MAIN.NEWSUBBEVY);
          }}
        >
          <Icon
            name='ion|plus-round'
            size={25}
            color='#fff'
            style={ styles.subBeviesAddIcon }
          />
        </TouchableHighlight>
      </View>
    );
  },

  _renderSubBevyList() {
    if(this.props.activeSuper._id == -1) {
      // dont render subbevies for the frontpage
      return <View />;
    }

    return (
      <View style={ styles.bevyList }>

        {/* Home Button */}
        <TouchableHighlight 
          style={[styles.bevyItem, (_.isEmpty(this.props.activeSub)) ? styles.bevyItemActive : {}]}
          onPress={() => {
            BevyActions.switchBevy(this.props.activeSuper._id);
            // close the side menu
            this.props.menuActions.close();
          }}
        >
          <Text style={styles.bevyItemText}>
            Home
          </Text>
        </TouchableHighlight>

        { _.map(this.props.subBevies, function(subBevy) {
          var active = (subBevy._id == this.props.activeSub._id);
          var bevyItemStyles = [styles.bevyItem];
          if(active) bevyItemStyles.push(styles.bevyItemActive);
          return (
            <TouchableHighlight
              key={ 'bevylist:' + subBevy._id }
              style={bevyItemStyles}
              onPress={() => {
                BevyActions.switchBevy(subBevy._id);
                // close the side menu
                this.props.menuActions.close();
              }}
            >
              <Text style={styles.bevyItemText}>
                { subBevy.name }
              </Text>
            </TouchableHighlight>
          );
        }.bind(this)) }
      </View>
    );
  },
  
  render: function() {
    return (
      <View style={styles.container}>

        <View style={{
          height: StatusBarSizeIOS.currentHeight
        }} />

        <Accordion
          ref='activeBevy'
          onPress={() => {
            console.log('pressed');
            this.setState({
              activeBevyHeaderOpen: !this.state.activeBevyHeaderOpen
            });
          }}
          header={
            <View style={ styles.activeBevy }>
              <Text style={ styles.activeBevyText }>
                { this.props.activeSuper.name }
              </Text>
              {/* TODO: @kevin CSS animate this chevron? */}
              <Icon
                name={(this.state.activeBevyHeaderOpen) ? 'ion|chevron-down' : 'ion|chevron-right'}
                size={ 25 }
                color='#fff'
                style={ styles.activeBevyChevron }
              />
            </View>
          }
          content={
            <View style={ styles.bevyList }>
              { _.map(this.state.bevies, function(bevy) {
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

              <TouchableHighlight
                style={ styles.bevyAddItem }
                onPress={() => {
                  this.props.mainNavigator.jumpTo(routes.MAIN.NEWBEVY);
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
            </View>
          }
        />

        { this._renderSubBevyBar() }
        { this._renderSubBevyList() }

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
  activeBevy: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#333'
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
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: '#333'
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
    borderTopWidth: 1,
    borderTopColor: '#333'
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

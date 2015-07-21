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
var constants = require('./../../constants.js');
var BevyActions = require('./../BevyActions');
var BEVY = constants.BEVY;

var BevyList = React.createClass({
  propTypes: {
    myBevies: React.PropTypes.array,
    activeBevy: React.PropTypes.object,
    menuActions: React.PropTypes.object
  },

  getInitialState() {
    return {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.props.myBevies),
      subBevies: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows([]),
      activeBevyHeaderOpen: false
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(nextProps.myBevies),
      subBevies: this.state.dataSource.cloneWithRows([])
    });
  },

  changeBevy: function(rowData) {

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
          }
          content={
            <View style={ styles.bevyList }>
              { _.map(this.props.myBevies, function(bevy) {
                // dont render active bevy
                if(bevy._id == this.props.activeBevy._id) return <View />;

                return (
                  <TouchableHighlight 
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


        <View style={ styles.subBevies }>
          <Text style={ styles.subBeviesTitle }>
            Subbevies
          </Text>
          <TouchableHighlight
            style={ styles.subBeviesAdd }
            onPress={() => {

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


        <ListView
          dataSource={ this.state.subBevies }
          style={ styles.bevyList }
          renderRow={(bevy) => (
            <TouchableHighlight 
              style={styles.rowContainer}
              onPress={() => {
                BevyActions.switchBevy(bevy._id);
                this.props.menuActions.close();
              }}
            >
              <Text style={styles.whiteText}>
                { bevy.name }
              </Text>
            </TouchableHighlight>
          )}
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

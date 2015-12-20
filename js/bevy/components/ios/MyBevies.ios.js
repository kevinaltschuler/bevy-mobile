/**
 * MyBevies.js
 * kevin made this
 * the yung sauce villain
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
var Icon = require('react-native-vector-icons/Ionicons');
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

  changeBevy: function(rowData) {

  },

  _renderPublicHeader() {
    if(!this.props.loggedIn) return (
      <Text style={ styles.publicHeader }>
        All Bevies
      </Text>
    );
    return (
      <View style={ styles.myBeviesHeader }>
        <View style={styles.myBeviesHeaderTextWrapper}>
          <Text style={ styles.myBeviesHeaderText }>
            My Bevies
          </Text>
        </View>
        <TouchableHighlight
          underlayColor='#333'
          style={ styles.bevyAddButton }
          onPress={() => { this.setState({ showAddBevyModal: true }); }}
        >
          <Icon
            name='ios-plus-empty'
            color='#999'
            size={ 30 }
            style={{ width: 30, height: 30 }}
          />
        </TouchableHighlight>
        <AddBevyModal
          onHide={ this.onHideModal }
          isVisible={ this.state.showAddBevyModal }
          mainNavigator={ this.props.mainNavigator }
          menuActions={ this.context.menuActions }
        />
      </View>
    );
  },

  _renderBevyList() {
    var bevies = (this.props.loggedIn)
    ? _.filter(this.props.myBevies, function(bevy) { return bevy.parent == null })
    : this.props.publicBevies;

    var bevyList = [];

    for(var key in bevies) {
      var bevy = bevies[key];
      if(bevy._id == -1) {
        continue;
      }

      bevyList.push(
        <BevyCard 
          bevy={bevy}
          bevyNavigator={ this.props.bevyNavigator }
          key={ 'bevylist:' + bevy._id }
          mainNavigator={this.props.mainNavigator}
        />
      );
    }

    return (
      <ScrollView 
        contentContainerStyle={ styles.bevyList }
        automaticallyAdjustContentInsets={true}
        showsVerticalScrollIndicator={true}
        style={{flex: 1, marginTop: -23, marginBottom: 49}}
      >
        { bevyList }
      </ScrollView>
    );
  },

  render: function() {

    var right = (
      <TouchableOpacity
        activeOpacity={.3}
        onPress={() => {
          this.props.mainNavigator.push(routes.MAIN.NEWBEVY);
        }}
        style={{
          marginRight: 10,
          borderRadius: 2,
          paddingHorizontal: 5,
          paddingVertical: 5,
        }}
      >
        <Icon
          name='ios-plus-empty'
          size={ 30 }
          color={ '#999' }
          style={{}}
        />
      </TouchableOpacity>
    );

    return (
      <View style={styles.container}>

        <Navbar
          center={<Text style={{color: '#999', fontSize: 18, marginLeft: 10, fontWeight: 'bold'}}>My Bevies</Text>}
          right={ right }
          activeBevy={ this.props.activeBevy }
          fontColor={ '#999' }
          { ...this.props }
          styleBottom={{
            backgroundColor: '#fff',
            height: 40,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
            marginTop: 0
          }}
        />

        <View style={{
          height: StatusBarSizeIOS.currentHeight
        }} />

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
    width: constants.width,
    height: constants.height - 48,
    backgroundColor: '#eee',
  },
  publicHeader: {
    fontSize: 18,
    color: '#999',
    paddingLeft: 10,
    marginBottom: 10,
    marginTop: 10
  },
  myBeviesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: .5,
    borderBottomWidth: .5,
    height: 48,
    borderTopColor: 'rgba(255,255,255,.5)',
    borderBottomColor: 'rgba(255,255,255,.5)',
    backgroundColor: '#333'
  },
  myBeviesHeaderTextWrapper: {
    justifyContent: 'center',
    borderTopWidth: .5,
    borderBottomWidth: .5,
    height: 48,
    borderTopColor: 'rgba(255,255,255,.5)',
    borderBottomColor: 'rgba(255,255,255,.5)',
    flex: 1
  },
  myBeviesHeaderText: {
    fontSize: 15,
    color: '#999',
    paddingLeft: 10
  },
  bevyAddButton: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },

  profileHeader: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: .5,
    borderBottomColor: '#555'
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10
  },
  profileDetails: {
    flex: 1,
    flexDirection: 'column'
  },
  profileName: {
    color: '#fff',
    fontSize: 15
  },
  profileEmail: {
    color: '#eee',
    fontSize: 12
  },

  bevyList: {
    flexDirection: 'row',
    marginTop: -15,
    width: constants.width,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10
  },
  bevyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  bevyItemActive: {
    backgroundColor: '#444',
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

module.exports = MyBevies;

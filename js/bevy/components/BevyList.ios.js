/**
 * BevyList.js
 * kevin made this
 * the yung sauce villain
 */
'use strict';

var React = require('react-native');
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
var AddBevyModal = require('./AddBevyModal.ios.js');

var FileActions = require('./../../file/FileActions');
var StatusBarSizeIOS = require('react-native-status-bar-size');
var constants = require('./../../constants');
var routes = require('./../../routes');
var BevyActions = require('./../BevyActions');
var UserActions = require('./../../user/UserActions');
var BEVY = constants.BEVY;

var BevyList = React.createClass({
  propTypes: {
    myBevies: React.PropTypes.array,
    activeBevy: React.PropTypes.object,
    menuActions: React.PropTypes.object,
    user: React.PropTypes.object,
    loggedIn: React.PropTypes.bool,
    mainNavigator: React.PropTypes.object
  },

  getInitialState() {
    return {
      showAddBevyModal: false
    };
  },

  changeBevy: function(rowData) {

  },

  _renderProfileHeader() {
    if(!this.props.loggedIn) {
      return (
        <View style={ styles.profileActions }>
          <TouchableHighlight
            underlayColor='#333'
            style={ styles.profileAction }
            onPress={() => {
              this.props.authModalActions.open('Log In');
            }}
          >
            <Text style={ styles.profileActionText }>Log In</Text>
          </TouchableHighlight>
        </View>
      );
    }
    return (
      <View style={ styles.profileHeader }>
        <Image 
          source={{ uri: this.props.user.image_url }}
          style={ styles.profileImage }
        />
        <View style={ styles.profileDetails }>
          <Text style={ styles.profileName }>{ this.props.user.displayName }</Text>
          <Text style={ styles.profileEmail }>{ this.props.user.email }</Text>
        </View>
      </View>
    );
  },

  _renderPublicHeader() {
    if(!this.props.loggedIn) return (
      <Text style={ styles.publicHeader }>
        Public Bevies
      </Text>
    );
    return (
      <View style={ styles.myBeviesHeader }>
        <Text style={ styles.myBeviesHeaderText }>
          My Bevies
        </Text>
        <TouchableHighlight
          underlayColor='#333'
          style={ styles.bevyAddButton }
          onPress={() => { this.setState({ showAddBevyModal: true }); }}
        >
          <Icon
            name='ion|ios-plus-empty'
            color='#999'
            size={ 30 }
            style={{ width: 30, height: 30 }}
          />
        </TouchableHighlight>
        <AddBevyModal 
          isVisible={ this.state.showAddBevyModal }
          onHide={() => { this.setState({ showAddBevyModal: false }); }}
          mainNavigator={ this.props.mainNavigator }
          menuActions={ this.props.menuActions }
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
      </View>
    );
  },
  
  render: function() {
    return (
      <View style={styles.container}>

        <View style={{
          height: StatusBarSizeIOS.currentHeight
        }} />

        { this._renderProfileHeader() }

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
    height: constants.height,
    backgroundColor: '#111',
  },

  publicHeader: {
    fontSize: 15,
    color: '#999',
    paddingLeft: 10,
    marginBottom: 10,
    marginTop: 10
  },
  myBeviesHeader: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  myBeviesHeaderText: {
    flex: 1,
    fontSize: 15,
    color: '#999',
    paddingLeft: 10
  },
  bevyAddButton: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10
  },

  profileHeader: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333'
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

/**
 * BevyList.js
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
  ScrollView
} = React;
var Icon = require('react-native-vector-icons/Ionicons');

var PostList = require('./../../post/components/PostList.ios.js');
var AddBevyModal = require('./AddBevyModal.ios.js');

var FileActions = require('./../../file/FileActions');
var StatusBarSizeIOS = require('react-native-status-bar-size');
var _ = require('underscore');
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

  onHideModal() {
    this.setState({
      showAddBevyModal: false
    })
  },

  changeBevy: function(rowData) {

  },

  _renderProfileHeader() {
    if(!this.props.loggedIn) {
      return ( <View/> );
          {/*<TouchableHighlight
            underlayColor='#333'
            style={{ 
              height: 48, 
              borderBottomWidth: 1, 
              borderBottomColor: 'rgba(255,255,255,.4)', 
              padding: 10,
            }}
            onPress={() => {
              this.props.authModalActions.open('Log In');
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16, marginLeft: 2}}>Log In</Text>
          </TouchableHighlight>
      );*/}
    }

    var image_url = (_.isEmpty(this.props.user.image_url))
    ? constants.siteurl + '/img/user-profile-icon.png'
    : this.props.user.image_url;

    return (
      <View style={ styles.profileHeader }>
        <Image 
          source={{ uri: image_url }}
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

    if(!this.props.loggedIn) {
      bevies.unshift({
        _id: '-1',
        name: 'Frontpage'
      });
    }

    return (
      <ScrollView style={ styles.bevyList }>
        { _.map(bevies, function(bevy) {
          var active = (bevy._id == this.props.activeBevy._id);

          if(bevy._id == -1) {
            return <View/>;
          }

          return (
            <TouchableHighlight 
              key={ 'bevylist:' + bevy._id }
              underlayColor='rgba(255,255,255,.5)'
              style={ (active) ? styles.bevyItemActive : styles.bevyItem }
              onPress={() => {
                if(active) return;
                BevyActions.switchBevy(bevy._id);
                // close the side menu
                this.context.menuActions.close();
              }}
            >
              <Text style={ (active) ? styles.bevyItemActiveText : styles.bevyItemText }>
                { bevy.name }
              </Text>
            </TouchableHighlight>
          );
        }.bind(this)) }
      </ScrollView>
    );
  },
  
  render: function() {
    return (
      <View style={styles.container}>

        <View style={{
          height: StatusBarSizeIOS.currentHeight
        }} />

        { this._renderProfileHeader() }

        <TouchableHighlight 
          key={ 'bevylist:' + -1 }
          underlayColor='rgba(255,255,255,.5)'
          style={ (this.props.activeBevy._id == -1) ? styles.bevyItemActive : styles.bevyItem }
          onPress={() => {
            if(this.props.activeBevy._id == -1) return;
            BevyActions.switchBevy(-1);
            // close the side menu
            this.context.menuActions.close();
          }}
        >
          <Text style={ (this.props.activeBevy._id == -1) ? styles.bevyItemActiveText : styles.bevyItemText }>
            Frontpage
          </Text>
        </TouchableHighlight>

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
    backgroundColor: '#333',
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
    flex: 1,
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

BevyList.contextTypes = {
  menuActions: React.PropTypes.object.isRequired
};

module.exports = BevyList;

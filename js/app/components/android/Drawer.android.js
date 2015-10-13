/**
 * Drawer.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Image,
  TouchableNativeFeedback,
  StyleSheet
} = React;
var ProfileRow = require('./../../../user/components/android/ProfileRow.android.js');
var BevyList = require('./../../../bevy/components/android/BevyList.android.js');
var Icon = require('react-native-vector-icons/MaterialIcons');

var routes = require('./../../../routes');

var Drawer = React.createClass({
  propTypes: {
    drawerActions: React.PropTypes.object,
    mainRoute: React.PropTypes.object,
    mainNavigator: React.PropTypes.object,
    loggedIn: React.PropTypes.bool,
    user: React.PropTypes.object
  },

  _renderProfile() {
    if(!this.props.loggedIn) {
      return (
        <TouchableNativeFeedback
          onPress={() => {
            this.props.mainNavigator.push(routes.MAIN.LOGIN);
          }}
        >
          <View style={ styles.logInButton }>
            <Text style={ styles.logInButtonText }>Log In</Text>
          </View>
        </TouchableNativeFeedback>
      );
    } else {
      return (
        <ProfileRow
          user={ this.props.user }
          style={{
            backgroundColor: '#333',
            borderBottomColor: '#444',
            borderBottomWidth: 1
          }}
        />
      );
    }
  },

  _renderBeviesHeader() {
    if(!this.props.loggedIn) {
      return (
        <View style={ styles.myBeviesHeader }>
          <Text style={ styles.myBeviesText }>Public Bevies</Text>
        </View>
      );
    } else {
      return (
        <View style={ styles.myBeviesHeader }>
          <Text style={ styles.myBeviesText }>My Bevies</Text>
          <TouchableNativeFeedback
            background={ TouchableNativeFeedback.Ripple('#FFF', false) } 
            onPress={ () => {}}
          >
            <View style={ styles.bevyAddButton }>
              <Icon name='add' size={ 24 } color='#FFF' />
            </View>
          </TouchableNativeFeedback>
        </View>
      );
    }
  },

  render() {
    return (
      <View style={ styles.container }>
        { this._renderProfile() }
        { this._renderBeviesHeader() }
        <BevyList { ...this.props } />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#222'
  },
  logInButton: {
    flexDirection: 'row',
    padding: 10
  },
  logInButtonText: {
    flex: 1,
    color: '#FFF'
  },
  myBeviesHeader: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#333',
    borderBottomWidth: 1
  },
  myBeviesText: {
    flex: 1,
    marginLeft: 10,
    color: '#FFF'
  },
  bevyAddButton: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12
  }
});

module.exports = Drawer;
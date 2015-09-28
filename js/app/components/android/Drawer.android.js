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
var BevyList = require('./../../../bevy/components/android/BevyList.android.js');

var routes = require('./../../../routes');

var Drawer = React.createClass({
  propTypes: {
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
        <View style={ styles.profileRow }>
          <Image
            //source={{ uri: this.props.user.image_url }}
            source={{ uri: 'http://joinbevy.com/img/user-profile-icon.png' }}
            style={ styles.profileImage }
          />
          <View style={ styles.profileDetails }>
            <Text style={ styles.displayName }>{ this.props.user.displayName }</Text>
            <Text style={ styles.email }>{ this.props.user.email }</Text>
          </View>
        </View>
      );
    }
  },

  render() {
    return (
      <View style={ styles.container }>
        { this._renderProfile() }
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
    color: '#fff'
  },
  profileRow: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingRight: 10
  },
  profileImage: {
    height: 30,
    width: 30,
    borderRadius: 15,
    marginRight: 10
  },
  profileDetails: {
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  displayName: {
    color: '#FFF'
  },
  email: {
    color: '#FFF'
  }
});

module.exports = Drawer;
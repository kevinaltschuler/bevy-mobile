/**
 * SettingsView.ios.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  ScrollView,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet
} = React;
var {
  Icon
} = require('react-native-icons');

var Navbar = require('./../../shared/components/Navbar.ios.js');
var SettingsItem = require('./../../shared/components/SettingsItem.ios.js');

var SettingsView = React.createClass({

  propTypes: {
    loggedIn: React.PropTypes.bool,
    user: React.PropTypes.object
  },

  getInitialState() {
    return {

    };
  },

  _renderUserHeader() {
    if(!this.props.loggedIn) return <View />;
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

  render() {
    return (
      <View style={ styles.container }>
        <Navbar
          center='Settings'
          { ...this.props }
        />
        <ScrollView style={ styles.scrollView }>
          { this._renderUserHeader() }

          <Text style={ styles.settingsTitle }>Account</Text>
          <SettingsItem
            title='View Public Profile'
            onPress={() => {}}
          />
          <SettingsItem
            title='Change Profile Picture'
            onPress={() => {}}
          />
          <SettingsItem
            title='Sign Out'
            onPress={() => {}}
          />

          <Text style={[ styles.settingsTitle, { marginTop: 15 } ]}>Settings</Text>
          <SettingsItem
            title='Placeholder Setting'
            onPress={() => {}}
            checked={ true }
          />
        </ScrollView>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee',
    flex: 1,
    flexDirection: 'column'
  },
  scrollView: {
    flex: 1
  },

  profileHeader: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
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
    color: '#000', 
    fontSize: 15
  },
  profileEmail: {
    color: '#888', 
    fontSize: 12
  },

  settingsTitle: {
    color: '#888',
    fontSize: 15,
    marginLeft: 10,
    marginBottom: 5
  },
});

module.exports = SettingsView;
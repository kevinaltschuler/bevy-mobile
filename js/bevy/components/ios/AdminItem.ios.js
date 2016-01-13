/**
 * AdminItem.ios.js
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity
} = React;

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var resizeImage = require('./../../../shared/helpers/resizeImage');

var AdminItem = React.createClass({
  propTypes: {
    admin: React.PropTypes.object,
    mainNavigator: React.PropTypes.object
  },

  goToProfile() {
    var route = routes.MAIN.PROFILE;
    route.profileUser = this.props.admin;
    this.props.mainNavigator.push(route);
  },

  render() {
    var adminImageURL = (_.isEmpty(this.props.admin.image))
      ? constants.siteurl + '/img/user-profile-icon.png'
      : resizeImage(this.props.admin.image, 64, 64).url;

    return (
      <TouchableOpacity
        activeOpacity={ 0.5 }
        style={ styles.container }
        onPress={ this.goToProfile }
      >
        <View style={ styles.container }>
          <Image
            style={ styles.image }
            source={{ uri: adminImageURL }}
          />
          <Text style={ styles.name }>
            { this.props.admin.displayName }
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    height: 60
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
    marginLeft: 15,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  name: {
    flex: 1,
    fontSize: 17,
    color: '#222',
    marginRight: 15
  }
});

module.exports = AdminItem;

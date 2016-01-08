/**
 * PersonItem.android.js
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
  TouchableHighlight
} = React;

var _ = require('underscore');
var constants = require('./../../../constants');
var resizeImage = require('./../../../shared/helpers/resizeImage');

var PersonItem = React.createClass({
  propTypes: {
    user: React.PropTypes.object
  },

  render() {
    var userImageURL = (_.isEmpty(this.props.user.image))
      ? constants.siteurl + '/img/user-profile-icon.png'
      : resizeImage(this.props.user.image, 64, 64).url;

    return (
      <TouchableHighlight
        underlayColor='rgba(0,0,0,.1)'
        onPress={ this.onSelect }
      >
        <View style={ styles.container }>
          <Image
            style={ styles.image }
            source={{ uri: userImageURL }}
          />
          <Text style={ styles.name }>
            { this.props.user.displayName }
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    width: constants.width,
    height: 48,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16
  },
  image: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10
  },
  name: {
    flex: 1,
    color: '#000',
    textAlign: 'left',
    fontSize: 17
  }
});

module.exports = PersonItem;

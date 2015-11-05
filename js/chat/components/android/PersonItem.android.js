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
  TouchableNativeFeedback
} = React;

var constants = require('./../../../constants');

var PersonItem = React.createClass({
  propTypes: {
    user: React.PropTypes.object
  },

  render() {
    return (
      <TouchableNativeFeedback
        background={ TouchableNativeFeedback.Ripple('#DDD', false) }
        onPress={ this.onSelect }
      >
        <View style={ styles.container }>
          <Image
            style={ styles.image }
            source={{ uri: this.props.user.image_url }}
          />
          <Text style={ styles.name }>
            { this.props.user.displayName }
          </Text>
        </View>
      </TouchableNativeFeedback>
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
    paddingHorizontal: 10
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
    textAlign: 'left'
  }
});

module.exports = PersonItem;
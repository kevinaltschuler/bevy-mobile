/**
 * PostLinkItem.ios.js
 *
 * Item for the PostLinks component
 * Handles opening the webview for its link
 *
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');

var PostLinkItem = React.createClass({
  propTypes: {
    link: React.PropTypes.string,
    mainNavigator: React.PropTypes.object
  },

  onPress() {

  },

  render() {
    return (
      <TouchableOpacity
        activeOpacity={ 0.5 }
        onPress={ this.onPress }
      >
        <View style={ styles.container }>
          <Icon
            name='link'
            size={ 36 }
            color='#AAA'
          />
          <Text style={ styles.linkText }>
            { this.props.link }
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F8F8',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  linkText: {
    color: '#666',
    fontSize: 17,
    marginLeft: 10
  }
});

module.exports = PostLinkItem;

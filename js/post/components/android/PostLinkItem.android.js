/**
 * PostLinkItem.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TouchableNativeFeedback,
  StyleSheet
} = React;
var Icon = require('./../../../shared/components/android/Icon.android.js');

var PostLinkItem = React.createClass({
  propTypes: {
    link: React.PropTypes.string,
    onPress: React.PropTypes.func
  },

  press() {
    this.props.onPress(this.props.link);
  },

  render() {
    return (
      <TouchableNativeFeedback
        onPress={ this.press }
      >
        <View
          style={ styles.linkButton }
        >
          <Icon
            name='link'
            size={ 36 }
            color='#AAA'
          />
          <Text style={ styles.linkText }>
            { this.props.link }
          </Text>
        </View>
      </TouchableNativeFeedback>
    );
  }
});

var styles = StyleSheet.create({
  linkButton: {
    backgroundColor: '#FFF',
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10
  },
  linkText: {
    color: '#666',
    fontSize: 14,
    marginLeft: 10
  }
});

module.exports = PostLinkItem;

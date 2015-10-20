/**
 * AccountItem.android.js
 * @author albert
 * @flow
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

var AccountItem = React.createClass({
  propTypes: {
    account: React.PropTypes.object,
    onSelect: React.PropTypes.func
  },

  select() {
    this.props.onSelect(this.props.account);
  },

  render() {
    return (
      <TouchableNativeFeedback
        background={ TouchableNativeFeedback.Ripple('#DDD', false) }
        onPress={ this.select }
      >
        <View style={ styles.container }>
          <Image
            style={ styles.image }
            source={{ uri: this.props.account.image_url }}
          />
          <Text style={ styles.name }>
            { this.props.account.displayName }
          </Text>
        </View>
      </TouchableNativeFeedback>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10
  },
  name: {
    flex: 1,
    color: '#333'
  }
});

module.exports = AccountItem;
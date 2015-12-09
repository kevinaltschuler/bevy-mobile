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
  TouchableHighlight,
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
      <TouchableHighlight
        underlayColor={'rgba(0,0,0,.3)'}
        onPress={ this.select }
      >
        <View style={ styles.container }>
          <Image
            style={ styles.image }
            source={{ uri: this.props.account.image_url }}
          />
          <View style={{flexDirection: 'column', height: 48}}>
            <Text style={ styles.name }>
              { this.props.account.displayName }
            </Text>
            <Text style={ styles.email }>
              { this.props.account.email || 'no email'}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 20
  },
  name: {
    flex: 1,
    color: '#333',
    fontSize: 18
  },
  email: {
    flex: 1,
    color: '#777',
    fontSize: 16
  }
});

module.exports = AccountItem;
/**
 * AddedUserItem.android.js
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

var _ = require('underscore');

var AddedUserItem = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    onRemove: React.PropTypes.func
  },

  onRemove() {
    this.props.onRemove(this.props.user);
  },

  render() {
    return (
      <View style={ styles.addedUser }>
        <Text style={ styles.addedUserText }>
          { this.props.user.displayName }
        </Text>
        <TouchableOpacity
          activeOpacity={ 0.5 }
          onPress={ this.onRemove }
        >
          <View style={ styles.removeButton }>
            <Icon
              name='close'
              size={ 18 }
              color='#FFF'
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  addedUser: {
    backgroundColor: '#2CB673',
    paddingHorizontal: 8,
    height: 36,
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
    marginBottom: 6,
  },
  addedUserText: {
    color: '#FFF',
    fontSize: 17
  },
  removeButton: {
    height: 36,
    marginLeft: 4,
    flexDirection: 'row',
    alignItems: 'center'
  }
});

module.exports = AddedUserItem;

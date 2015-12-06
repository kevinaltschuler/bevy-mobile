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
  TouchableNativeFeedback,
  StyleSheet
} = React;
var Icon = require('./../../../shared/components/android/Icon.android.js');

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
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#62D487') }
          onPress={ this.onRemove }
        >
          <View style={ styles.removeButton }>
            <Icon
              name='close'
              size={ 18 }
              color='#FFF'
            />
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  addedUser: {
    backgroundColor: '#2CB673',
    paddingHorizontal: 4,
    height: 24,
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
    marginBottom: 6,
  },
  addedUserText: {
    color: '#FFF'
  },
  removeButton: {
    height: 24,
    marginLeft: 4,
    flexDirection: 'row',
    alignItems: 'center'
  }
});

module.exports = AddedUserItem;
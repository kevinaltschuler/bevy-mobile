/**
 * BevyTagItem.android.js
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

var _ = require('underscore');
var BevyActions = require('./../../../bevy/BevyActions');

var BevyTagItem = React.createClass({
  propTypes: {
    tag: React.PropTypes.object,
    isAdmin: React.PropTypes.bool,
    onRemove: React.PropTypes.func
  },

  remove() {
    this.props.onRemove(this.props.tag);
  },

  _renderRemoveButton() {
    if(this.props.isAdmin) {
      return (
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#EEE', false) }
          onPress={ this.remove }
        >
          <View style={ styles.removeButton }>
            <Icon
              name='close'
              size={ 30 }
              color='#888'
            />
          </View>
        </TouchableNativeFeedback>
      );
    } else return <View />;
  },

  render() {
    return (
      <View style={ styles.container }>
        <View style={[ styles.color, { backgroundColor: this.props.tag.color } ]} />
        <Text style={ styles.name }>
          { this.props.tag.name }
        </Text>
        { this._renderRemoveButton() }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10
  },
  color: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10
  },
  name: {
    flex: 1,
    textAlign: 'left'
  },
  removeButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8
  }
});

module.exports = BevyTagItem;

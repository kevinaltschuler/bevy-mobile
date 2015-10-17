/**
 * ActionSheetItem.android.js
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

var constants = require('./../../../constants');

var ActionSheetItem = React.createClass({
  propTypes: {
    index: React.PropTypes.string,
    option: React.PropTypes.string,
    onSelect: React.PropTypes.func
  },

  render() {
    return (
      <TouchableNativeFeedback
        background={ TouchableNativeFeedback.Ripple('#EEE', false) }
        onPress={() => {
          this.props.onSelect(this.props.index);
        }}
      >
        <View style={ styles.optionItem }>
          <Text style={ styles.optionItemText }>
            { this.props.option }
          </Text>
        </View>
      </TouchableNativeFeedback>
    );
  }
});

var styles = StyleSheet.create({
  optionItem: {
    width: constants.width * (2/3),
    height: 48,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  optionItemText: {
    flex: 1,
    color: '#000',
    fontSize: 16
  }
});

module.exports = ActionSheetItem;
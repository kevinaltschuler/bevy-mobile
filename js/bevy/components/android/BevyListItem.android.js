/**
 * BevyListItem.android.js
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

var BevyListItem = React.createClass({
  propTypes: {
    bevy: React.PropTypes.object
  },

  render() {
    return (
      <TouchableNativeFeedback
        background={ TouchableNativeFeedback.Ripple('#AAA', false) }
        onPress={() => {

        }}
      >
        <View style={ styles.container }>
          <Text style={ styles.bevyNameText }>{ this.props.bevy.name }</Text>
        </View>
      </TouchableNativeFeedback>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15
  },
  bevyNameText: {
    fontSize: 15,
    color: '#FFF'
  }
});

module.exports = BevyListItem;
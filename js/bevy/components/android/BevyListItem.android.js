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

var _ = require('underscore');
var BevyActions = require('./../../BevyActions');

var BevyListItem = React.createClass({
  propTypes: {
    bevy: React.PropTypes.object,
    activeBevy: React.PropTypes.object,
    drawerActions: React.PropTypes.object
  },

  getInitialState() {
    return {
      active: this.props.activeBevy._id == this.props.bevy._id
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      active: nextProps.activeBevy._id == nextProps.bevy._id
    });
  },

  render() {
    return (
      <TouchableNativeFeedback
        background={ TouchableNativeFeedback.Ripple('#AAA', false) }
        onPress={() => {
          if(this.state.active) return;
          BevyActions.switchBevy(this.props.bevy._id);
          // close the side menu
          this.props.drawerActions.close();
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
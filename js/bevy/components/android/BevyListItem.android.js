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
var Icon = require('./../../../shared/components/android/Icon.android.js');

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

  _renderActiveChevron() {
    if(this.state.active) {
      return (
        <View style={ styles.activeChevron }>
          <Icon
            name='chevron-right'
            size={ 30 }
            color='#FFF'
          />
        </View>
      );
    } else return <View />;
  },

  render() {
    var activeStyle = (this.state.active)
    ? {
      backgroundColor: '#333'
    } : {
      backgroundColor: '#222'
    };
    return (
      <TouchableNativeFeedback
        background={ TouchableNativeFeedback.Ripple('#444', false) }
        onPress={() => {
          // if already in the bevy youre switching to, do nothing
          if(this.state.active) return;
          // call the switch action
          BevyActions.switchBevy(this.props.bevy._id);
          // close the side menu
          this.props.drawerActions.close();
        }}
      >
        <View style={[ styles.container, activeStyle ]}>
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
  activeChevron: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bevyNameText: {
    flex: 1,
    fontSize: 15,
    color: '#FFF'
  }
});

module.exports = BevyListItem;
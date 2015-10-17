/**
 * ActionSheet.android.js
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  StyleSheet
} = React;
var ActionSheetItem = require('./ActionSheetItem.android.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var noop = function() {};

var ActionSheet = React.createClass({
  getInitialState() {
    return {
      visible: false,
      options: [],
      callback: noop
    };
  },
  componentDidMount() {
    constants.setActionSheetActions({
      show: this.show,
      onSelect: this.onSelect
    });
  },

  show(options, callback) {
    this.setState({ 
      visible: true,
      options: options,
      callback: callback
    });
  },

  select(key) {
    this.state.callback(key);
    setTimeout(this.cancel, 500);
  },

  cancel() {
    this.setState({
      visible: false,
      options: []
    });
  },

  _renderOptions() {
    var options = [];
    for(var key in this.state.options) {
      var option = this.state.options[key];
      options.push(
        <ActionSheetItem
          key={ key }
          index={ key }
          option={ option }
          onSelect={ this.select }
        />
      );
    }
    return options;
  },

  render() {
    if(!this.state.visible) return <View />;
    return (
      <View style={ styles.container }>
        <TouchableWithoutFeedback
          onPress={ this.cancel }
        >
          <View style={ styles.backdrop } />
        </TouchableWithoutFeedback>
        <View style={ styles.optionList }>
          { this._renderOptions() }
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    width: constants.width,
    height: constants.height,
    position: 'absolute',
    top: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: constants.width,
    height: constants.height,
    backgroundColor: '#000',
    opacity: 0.5
  },
  optionList: {
    backgroundColor: '#FFF',
    flexDirection: 'column',
    paddingVertical: 8,
    borderRadius: 3
  }
});

module.exports = ActionSheet;
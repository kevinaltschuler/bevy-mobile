/**
 * BevyList.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  ScrollView,
  View,
  Text,
  StyleSheet
} = React;
var BevyListItem = require('./BevyListItem.android.js');

var BevyList = React.createClass({
  propTypes: {
    publicBevies: React.PropTypes.array,
    myBevies: React.PropTypes.array
  },

  _renderBevies() {
    var bevies = [];
    for(var key in this.props.myBevies) {
      var bevy = this.props.myBevies[key];
      bevies.push(
        <BevyListItem
          key={ 'bevylistitem:' + bevy._id }
          bevy={ bevy }
        />
      );
    }
    return bevies;
  },

  render() {
    return (
      <ScrollView style={ styles.container }>
        { this._renderBevies() }
      </ScrollView>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column'
  }
});

module.exports = BevyList;
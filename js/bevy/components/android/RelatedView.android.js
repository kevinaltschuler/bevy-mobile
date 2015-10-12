/**
 * RelatedView.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  ScrollView,
  Text,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var BevyBar = require('./BevyBar.android.js');
var RelatedBevyItem = require('./RelatedBevyItem.android.js');

var _ = require('underscore');
var BevyStore = require('./../../BevyStore');

var RelatedView = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object,
    bevyNavigator: React.PropTypes.object,
    bevyRoute: React.PropTypes.object
  },

  _renderBevyItems() {
    var bevies = [];
    var relatedBevies = this.props.activeBevy.siblings;
    for(var key in relatedBevies) {
      var bevy = BevyStore.getBevy(relatedBevies[key]);
      bevies.push(
        <RelatedBevyItem
          key={ 'relatedbevyitem:' + bevy._id }
          bevy={ bevy }
          bevyNavigator={ this.props.bevyNavigator }
        />
      );
    }
    return bevies;
  },

  render() {
    return (
      <View style={ styles.container }>
        <BevyBar
          activeBevy={ this.props.activeBevy }
          bevyNavigator={ this.props.bevyNavigator }
          bevyRoute={ this.props.bevyRoute }
        />
        <ScrollView style={ styles.bevyList }>
          { this._renderBevyItems() }
        </ScrollView>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  bevyList: {
    flex: 1
  }
});

module.exports = RelatedView;
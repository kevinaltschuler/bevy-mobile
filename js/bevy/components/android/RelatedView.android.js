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
    if(_.isEmpty(relatedBevies)) {
      return (
        <View style={ styles.noBeviesContainer }>
          <Text style={ styles.noBevies }>No Related Bevies!</Text>
        </View>
      );
    }
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
    flex: 1,
    backgroundColor: '#EEE'
  },
  bevyList: {
    flex: 1,
    paddingTop: 10
  },
  noBeviesContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  noBevies: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    color: '#AAA'
  }
});

module.exports = RelatedView;
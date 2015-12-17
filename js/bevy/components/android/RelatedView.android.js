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
  BackAndroid,
  TouchableNativeFeedback,
  StyleSheet
} = React;
var Icon = require('./../../../shared/components/android/Icon.android.js');
var BevyBar = require('./BevyBar.android.js');
var RelatedBevyItem = require('./RelatedBevyItem.android.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var BevyStore = require('./../../BevyStore');

var RelatedView = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object,
    bevyNavigator: React.PropTypes.object,
    bevyRoute: React.PropTypes.object,
    user: React.PropTypes.object
  },

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.onBackButton);
  },
  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.onBackButton);
  },

  onBackButton() {
    this.props.bevyNavigator.pop();
    return true;
  },

  goToAddRelatedView() {
    this.props.bevyNavigator.push(routes.BEVY.ADDRELATED);
  },

  _renderAddBevyButton() {
    if(_.findWhere(this.props.activeBevy.admins, { _id: this.props.user._id })
      == undefined) {
      // if the user is not an admin, dont render the add bevy button
      return <View />;
    }

    return (
      <TouchableNativeFeedback
        onPress={ this.goToAddRelatedView }
      >
        <View style={ styles.addBevyButton }>
          <Icon
            name='add'
            size={ 36 }
            color='#2CB673'
          />
          <Text style={ styles.addBevyButtonText }>
            Add Related Bevy
          </Text>
        </View>
      </TouchableNativeFeedback>
    );
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
          { this._renderAddBevyButton() }
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
    flex: 1
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
  },
  addBevyButton: {
    backgroundColor: '#FFF',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  addBevyButtonText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10
  }
});

module.exports = RelatedView;

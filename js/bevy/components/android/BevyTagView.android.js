/**
 * BevyTagView.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  ListView,
  BackAndroid,
  TouchableNativeFeedback,
  StyleSheet
} = React;
var BevyBar = require('./BevyBar.android.js');
var BevyTagItem = require('./BevyTagItem.android.js');
var Icon = require('./../../../shared/components/android/Icon.android.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var BevyActions = require('./../../../bevy/BevyActions');
var DialogAndroid = require('react-native-dialogs');

var BevyTagView = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object,
    bevyNavigator: React.PropTypes.object,
    bevyRoute: React.PropTypes.object,
    user: React.PropTypes.object,
    loggedIn: React.PropTypes.bool
  },

  getInitialState() {
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    var tags = this.props.activeBevy.tags;
    var isAdmin =
      _.findWhere(this.props.activeBevy.admins, { _id: this.props.user._id }) == undefined;
    return {
      dataSource: ds.cloneWithRows(tags),
      tags: tags,
      isAdmin: isAdmin
    };
  },

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.onBackButton);
  },
  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.onBackButton);
  },

  componentWillReceiveProps(nextProps) {
    var isAdmin =
      _.findWhere(nextProps.activeBevy.admins, { _id: nextProps.user._id }) == undefined;
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(nextProps.activeBevy.tags),
      tags: nextProps.activeBevy.tags,
      isAdmin: isAdmin
    });
  },

  onBackButton() {
    this.props.bevyNavigator.pop();
    return true;
  },

  goToNewTagView() {
    this.props.bevyNavigator.push(routes.BEVY.NEWTAG);
  },

  onTagRemove(tag) {
    var dialog = new DialogAndroid();
    dialog.set({
      title: 'Are you sure?',
      positiveText: 'Ok',
      negativeText: 'Cancel',
      onPositive: () => {
        BevyActions.removeTag(
          this.props.activeBevy._id,
          tag.name
        );
      }
    });
    dialog.show();
  },

  _renderHeader() {
    return (
      <View style={ styles.header }>
        <Text style={ styles.title }>
          Tags of { this.props.activeBevy.name }
        </Text>
        <TouchableNativeFeedback
          onPress={ this.goToNewTagView }
        >
          <View style={{
            backgroundColor: '#FFF',
            height: 48,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10
          }}>
            <Icon
              name='add'
              size={ 36 }
              color='#2CB673'
            />
            <Text style={{
              flex: 1,
              color: '#000',
              marginRight: 10
            }}>
              Add New Tag
            </Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  },

  render() {
    return (
      <View style={ styles.container }>
        <BevyBar
          activeBevy={ this.props.activeBevy }
          bevyNavigator={ this.props.bevyNavigator }
          bevyRoute={ this.props.bevyRoute }
        />
        <ListView
          dataSource={ this.state.dataSource }
          style={ styles.tagList }
          renderHeader={ this._renderHeader }
          renderRow={(tag) => {
            return (
              <BevyTagItem
                key={ 'tagitem:' + tag.name }
                tag={ tag }
                isAdmin={ this.state.isAdmin }
                onRemove={ this.onTagRemove }
              />
            );
          }}
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE'
  },
  header: {
    marginTop: 10
  },
  title: {
    flex: 1,
    textAlign: 'left',
    color: '#AAA',
    marginBottom: 4,
    marginLeft: 10,
    paddingHorizontal: 15
  },
  tagList: {
    flex: 1
  }
});

module.exports = BevyTagView;

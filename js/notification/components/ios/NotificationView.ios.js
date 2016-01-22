/**
 * NotificationView.ios.js
 * @author albert
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  ListView,
  RefreshControl,
  ScrollView
} = React;
var NotificationItem = require('./NotificationItem.ios.js');
var Icon = require('react-native-vector-icons/MaterialIcons');

var _ = require('underscore');
var constants = require('./../../../constants.js');
var NotificationActions = require('./../../../notification/NotificationActions');
var NotificationStore = require('./../../../notification/NotificationStore');
var NOTIFICATION = constants.NOTIFICATION;

var NotificationView = React.createClass({
  propTypes: {
    allNotifications: React.PropTypes.array
  },

  getInitialState() {
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    var notes = this.props.allNotifications;
    return {
      ds: ds.cloneWithRows(notes),
      notes: notes,
      loading: false
    };
  },

  componentDidMount() {
    NotificationStore.on(NOTIFICATION.FETCHING, this.onLoading);
    NotificationStore.on(NOTIFICATION.FETCHED, this.onLoaded);
  },
  componentWillUnmount() {
    NotificationStore.off(NOTIFICATION.FETCHING, this.onLoading);
    NotificationStore.off(NOTIFICATION.FETCHED, this.onLoaded);
  },

  onLoading() {
    this.setState({ loading: true });
  },
  onLoaded() {
    var notes = NotificationStore.getAll();
    this.setState({
      loading: false,
      ds: this.state.ds.cloneWithRows(notes),
      notes: notes
    });
  },
  onRefresh() {
    NotificationActions.fetch();
  },

  _renderNoNotificationsText() {
    if(_.isEmpty(this.state.notes) && !this.state.loading) {
      return (
        <View style={ styles.noNotificationsContainer }>
          <Text style={ styles.noNotificationsText }>
            No Notifications
          </Text>
        </View>
      );
    } else {
      return <View />;
    }
  },

  _renderFooter() {
    return (
      <View style={{
        width: constants.width,
        height: 60
      }}/>
    );
  },

  _renderNote(note) {
    return (
      <NotificationItem
        key={ 'note:' + note._id }
        mainNavigator={ this.props.mainNavigator }
        notification={ note }
      />
    );
  },

  _renderList() {
    return (
      <ListView
        ref={ ref => { this.NoteList = ref; }}
        style={ styles.noteList }
        dataSource={ this.state.ds }
        automaticallyAdjustContentInsets={ false }
        refreshControl={
          <RefreshControl
            refreshing={ this.state.loading }
            onRefresh={ this.onRefresh }
            tintColor='#AAA'
            title='Loading...'
          />
        }
        renderFooter={ this._renderFooter }
        renderRow={ this._renderNote }
      />
    );
  },

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.topBarContainer }>
          <View style={{
            height: constants.getStatusBarHeight(),
            backgroundColor: '#2CB673'
          }}/>
          <View style={ styles.topBar }>
            <Text style={ styles.title }>
              Notifications
            </Text>
          </View>
        </View>
        { this._renderNoNotificationsText() }
        { this._renderList() }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee'
  },
  topBarContainer: {
    flexDirection: 'column',
    paddingTop: 0,
    overflow: 'visible',
    backgroundColor: '#2CB673'
  },
  topBar: {
    height: 48,
    backgroundColor: '#2CB673',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 17,
    textAlign: 'center',
    color: '#FFF'
  },
  noteList: {
    flex: 1
  },
  noNotificationsContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  noNotificationsText: {
    fontSize: 22,
    color: '#aaa'
  }
});

module.exports = NotificationView;

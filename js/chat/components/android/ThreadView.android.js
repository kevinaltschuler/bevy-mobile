/**
 * ThreadView.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  ListView,
  ScrollView,
  TouchableNativeFeedback,
  Text,
  StyleSheet
} = React;
var ThreadItem = require('./ThreadItem.android.js');
var Collapsible = require('react-native-collapsible');
var Icon = require('react-native-vector-icons/MaterialIcons');

var _ = require('underscore');
var constants = require('./../../../constants');

var ThreadView = React.createClass({
  propTypes: {
    allThreads: React.PropTypes.array,
    activeThread: React.PropTypes.object,
    chatNavigator: React.PropTypes.object,
    mainNavigator: React.PropTypes.object,
    loggedIn: React.PropTypes.bool
  },

  getInitialState() {
    var threads = this.props.allThreads;
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      ds: ds.cloneWithRows(threads),
      threads: threads,
      bevyPanelOpen: true,
      groupPanelOpen: true,
      pmPanelOpen: true
    };
  },

  componentWillReceiveProps(nextProps) {
    var threads = nextProps.allThreads;
    this.setState({
      ds: this.state.ds.cloneWithRows(threads),
      threads: threads
    });
  },

  _renderNoThreadsText() {
    if(_.isEmpty(this.props.allThreads)) {
      var hintText = (this.props.loggedIn)
        ? 'No Conversations'
        : 'Please Log In to Chat';
      return (
        <View style={ styles.noThreadsContainer }>
          <Text style={ styles.noThreads }>{ hintText }</Text>
        </View>
      );
    } else return (
      <View />
    );
  },

  _renderBevyThreads() {
    var bevyThreads = [];
    var threads = _.filter(this.state.threads, (thread) => !_.isEmpty(thread.bevy));
    for(var key in threads) {
      var thread = threads[key];
      bevyThreads.push(this._renderThreadItem(thread));
    }
    if(_.isEmpty(bevyThreads)) {
      bevyThreads = <Text style={ styles.noThreadsText }>No Bevy Chats</Text>;
    }
    return (
      <Collapsible duration={ 1000 } collapsed={ !this.state.bevyPanelOpen }>
        { bevyThreads }
      </Collapsible>
    );
  },
  _renderGroupThreads() {
    var groupThreads = [];
    var threads = _.filter(this.state.threads, (thread) => thread.type == 'group');
    for(var key in threads) {
      var thread = threads[key];
      groupThreads.push(this._renderThreadItem(thread));
    }
    if(_.isEmpty(groupThreads)) {
      groupThreads = <Text style={ styles.noThreadsText }>No Group Chats</Text>;
    }
    return (
      <Collapsible duration={ 1000 } collapsed={ !this.state.groupPanelOpen }>
        { groupThreads }
      </Collapsible>
    );
  },
  _renderPMThreads() {
    var pmThreads = [];
    var threads = _.filter(this.state.threads, (thread) => thread.type == 'pm');
    for(var key in threads) {
      var thread = threads[key];
      pmThreads.push(this._renderThreadItem(thread));
    }
    if(_.isEmpty(pmThreads)) {
      pmThreads = <Text style={ styles.noThreadsText }>No Private Chats</Text>;
    }
    return (
      <Collapsible duration={ 1000 } collapsed={ !this.state.pmPanelOpen }>
        { pmThreads }
      </Collapsible>
    );
  },
  _renderThreadItem(thread) {
    var active = false;
    if(thread._id == this.props.activeThread._id) active = true;
    return (
      <ThreadItem
        key={ thread._id }
        thread={ thread }
        user={ this.props.user }
        active={ active }
        chatNavigator={ this.props.chatNavigator }
        chatRoute={ this.props.chatRoute }
        mainNavigator={ this.props.mainNavigator }
      />
    );
  },

  render() {
    return (
      <View style={ styles.container }>
        { this._renderNoThreadsText() }
        <ListView
          dataSource={ this.state.ds }
          renderRow={ this._renderThreadItem }
          scrollRenderAheadDistance={ 300 }
          removeClippedSubviews={ true }
          initialListSize={ 10 }
          pageSize={ 10 }
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    borderTopColor: '#EEE',
    borderTopWidth: 1
  },
  threadList: {

  },
  panelHeader: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  panelHeaderText: {
    color: '#AAA'
  }
});

module.exports = ThreadView;
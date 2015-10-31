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
      threads: threads
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
  },
  noThreadsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  noThreads: {
    color: '#AAA',
    fontSize: 22,
    textAlign: 'center'
  }
});

module.exports = ThreadView;
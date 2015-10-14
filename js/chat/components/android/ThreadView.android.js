/**
 * ThreadView.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  ListView,
  Text,
  StyleSheet
} = React;
var ThreadItem = require('./ThreadItem.android.js');

var _ = require('underscore');

var ThreadView = React.createClass({
  propTypes: {
    allThreads: React.PropTypes.array,
    activeThread: React.PropTypes.object,
    chatNavigator: React.PropTypes.object,
    mainNavigator: React.PropTypes.object,
    loggedIn: React.PropTypes.bool
  },

  getInitialState() {
    var threadData = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      threads: threadData.cloneWithRows(this.props.allThreads)
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      threads: this.state.threads.cloneWithRows(nextProps.allThreads)
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

  render() {
    return (
      <View style={ styles.container }>
        { this._renderNoThreadsText() }
        <ListView
          dataSource={ this.state.threads }
          style={ styles.list }
          //renderHeader={() => (<View style={{marginTop: -20}}/>)}
          //renderFooter={() => (<View style={{marginBottom: -20}}/>)}
          renderRow={(thread) => {
            var active = false;
            if(thread._id == this.props.activeThread._id) active = true;
            return (
              <ThreadItem 
                thread={ thread }
                user={ this.props.user }
                active={ active }
                chatNavigator={ this.props.chatNavigator }
                mainNavigator={ this.props.mainNavigator }
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
    flexDirection: 'column'
  },
  list: {
    flex: 1
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
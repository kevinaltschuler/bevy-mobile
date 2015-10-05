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

var ThreadView = React.createClass({
  propTypes: {
    allThreads: React.PropTypes.array,
    activeThread: React.PropTypes.object,
    chatNavigator: React.PropTypes.object,
    mainNavigator: React.PropTypes.object
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

  render() {
    return (
      <View style={ styles.container }>
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

  }
});

module.exports = ThreadView;
'use strict';

var React = require('react-native');
var {
  View,
  ListView,
  Text,
  StyleSheet
} = React;
var {
  Icon
} = require('react-native-icons');

var ThreadItem = require('./ThreadItem.ios.js');

var ChatMenu = React.createClass({

  propTypes: {
    allThreads: React.PropTypes.array,
    activeThread: React.PropTypes.object,
    chatMenuActions: React.PropTypes.object
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
          renderRow={(thread) => {

            var active = false;
            if(thread._id == this.props.activeThread._id) active = true;

            return (
              <ThreadItem 
                thread={ thread }
                user={ this.props.user }
                active={ active }
                chatMenuActions={ this.props.chatMenuActions }
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
  }
});

module.exports = ChatMenu;
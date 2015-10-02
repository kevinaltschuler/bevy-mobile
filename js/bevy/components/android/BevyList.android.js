/**
 * BevyList.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  ListView,
  View,
  Text,
  StyleSheet
} = React;
var BevyListItem = require('./BevyListItem.android.js');

var BevyList = React.createClass({
  propTypes: {
    publicBevies: React.PropTypes.array,
    myBevies: React.PropTypes.array
  },

  getInitialState() {
    var bevyData = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      bevies: bevyData.cloneWithRows(this.props.myBevies)
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      bevies: this.state.bevies.cloneWithRows(nextProps.myBevies)
    });
  },

  render() {
    return (
      <ListView 
        dataSource={ this.state.bevies }
        style={ styles.container }
        renderRow={(bevy) => {
          return (
            <BevyListItem
              key={ 'bevylistitem:' + bevy._id }
              bevy={ bevy }
            />
          );
        }}
      />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  }
});

module.exports = BevyList;
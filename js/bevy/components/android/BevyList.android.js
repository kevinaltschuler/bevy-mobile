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
    drawerActions: React.PropTypes.object,
    publicBevies: React.PropTypes.array,
    myBevies: React.PropTypes.array,
    activeBevy: React.PropTypes.object,
    loggedIn: React.PropTypes.bool
  },

  getInitialState() {
    var bevyData = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var bevies = (this.props.loggedIn) 
      ? this.props.myBevies 
      : this.props.publicBevies;
    return {
      bevies: bevyData.cloneWithRows(bevies)
    };
  },

  componentWillReceiveProps(nextProps) {
    var bevies = (nextProps.loggedIn) 
      ? nextProps.myBevies 
      : nextProps.publicBevies;
    this.setState({
      bevies: this.state.bevies.cloneWithRows(bevies)
    });
  },

  _renderHeader() {
    return <View />;
  },

  render() {
    return (
      <ListView 
        dataSource={ this.state.bevies }
        style={ styles.container }
        renderHeader={ this._renderHeader }
        renderRow={(bevy) => {
          return (
            <BevyListItem
              key={ 'bevylistitem:' + bevy._id }
              bevy={ bevy }
              activeBevy={ this.props.activeBevy }
              drawerActions={ this.props.drawerActions }
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
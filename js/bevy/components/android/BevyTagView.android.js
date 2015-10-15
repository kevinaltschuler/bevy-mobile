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
  StyleSheet
} = React;
var BevyBar = require('./BevyBar.android.js');
var BevyTagItem = require('./BevyTagItem.android.js');

var _ = require('underscore');

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

  componentWillReceiveProps(nextProps) {
    var isAdmin = 
      _.findWhere(nextProps.activeBevy.admins, { _id: nextProps.user._id }) == undefined;
    this.setState({
      dataSource: dataSource.cloneWithRows(nextProps.activeBevy.tags),
      tags: nextProps.activeBevy.tags,
      isAdmin: isAdmin
    });
  },

  _renderHeader() {
    return (
      <View style={ styles.header }>
        <Text style={ styles.title }>
          Tags of { this.props.activeBevy.name }
        </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 15
  },
  title: {
    flex: 1,
    textAlign: 'left',
    color: '#AAA',
    marginBottom: 4
  },
  tagList: {
    flex: 1
  }
});

module.exports = BevyTagView;
/**
 * UserSearchItem.android.js
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');
var routes = require('./../../../routes.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var UserStore = require('./../../../user/UserStore');

var UserSearchItem = React.createClass({
  propTypes: {
    searchUser: React.PropTypes.object,
    onSelect: React.PropTypes.func,
    selected: React.PropTypes.bool,
    showIcon: React.PropTypes.bool,
    mainNavigator: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      searchUser: {},
      onSelect: _.noop,
      selected: false,
      showIcon: true
    };
  },

  getInitialState() {
    return {
      selected: false
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      selected: nextProps.selected
    });
  },

  onSelect() {
    var route = {
      name: routes.MAIN.PROFILE,
      profileUser: this.props.searchUser
    };
    this.props.mainNavigator.push(route);
  },

  _renderIcon() {
    if(!this.props.showIcon) return <View />;
    return (
      <Icon
        name='add'
        size={ 30 }
        color='#2CB673'
      />
    );
  },

  render() {
    var imageSource = UserStore.getUserImage(this.props.searchUser.image, 64, 64);

    return (
      <TouchableHighlight
        underlayColor='rgba(0,0,0,.1)'
        onPress={ this.onSelect }
      >
        <View style={ styles.container }>
          <Image
            style={ styles.image }
            source={ imageSource }
          />
          <View style={ styles.details }>
            <Text style={ styles.name }>
              { this.props.searchUser.displayName }
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    width: constants.width,
    height: 80,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10
  },
  details: {
    height: 80,
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    alignItems: 'center',
    borderBottomColor: '#eee'

  },
  name: {
    flex: 1,
    fontSize: 17,
    color: '#333'
  }
});

module.exports = UserSearchItem;

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
  TouchableNativeFeedback,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');

var _ = require('underscore');
var constants = require('./../../../constants');
var UserStore = require('./../../../user/UserStore');

var UserSearchItem = React.createClass({
  propTypes: {
    searchUser: React.PropTypes.object,
    onSelect: React.PropTypes.func,
    selected: React.PropTypes.bool,
    showIcon: React.PropTypes.bool
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
    this.props.onSelect(this.props.searchUser);
    this.setState({
      selected: !this.state.selected
    });
  },

  _renderIcon() {
    if(!this.props.showIcon) return <View />;
    return (
      <Icon
        name='add'
        //name={ (this.state.selected) ? 'check-box' : 'check-box-outline-blank' }
        size={ 30 }
        color='#2CB673'
      />
    );
  },

  render() {
    return (
      <TouchableNativeFeedback
        background={ TouchableNativeFeedback.Ripple('#DDD', false) }
        onPress={ this.onSelect }
      >
        <View style={ styles.container }>
          <Image
            style={ styles.image }
            source={ UserStore.getUserImage(this.props.searchUser, 30, 30) }
          />
          <View style={ styles.details }>
            <Text style={ styles.name }>
              { this.props.searchUser.displayName }
            </Text>
            { this._renderIcon() }
          </View>
        </View>
      </TouchableNativeFeedback>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    width: constants.width,
    height: 48,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  image: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10
  },
  details: {
    height: 48,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#EEE',
    borderBottomWidth: 1
  },
  name: {
    flex: 1,
    color: '#000'
  }
});

module.exports = UserSearchItem;
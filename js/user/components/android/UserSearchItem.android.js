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

var UserSearchItem = React.createClass({
  propTypes: {
    searchUser: React.PropTypes.object,
    onSelect: React.PropTypes.func,
    selected: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      searchUser: {},
      onSelect: _.noop
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

  render() {
    return (
      <TouchableNativeFeedback
        background={ TouchableNativeFeedback.Ripple('#DDD', false) }
        onPress={ this.onSelect }
      >
        <View style={ styles.container }>
          <Image
            style={ styles.image }
            source={{ uri: this.props.searchUser.image_url }}
          />
          <View style={ styles.details }>
            <Text style={ styles.name }>
              { this.props.searchUser.displayName }
            </Text>
            <Icon
              name='add'
              //name={ (this.state.selected) ? 'check-box' : 'check-box-outline-blank' }
              size={ 30 }
              color='#2CB673'
            />
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
    color: '#888'
  }
});

module.exports = UserSearchItem;
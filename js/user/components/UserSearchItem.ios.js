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
var Icon = require('react-native-vector-icons/Ionicons');

var _ = require('underscore');
var constants = require('./../../constants');

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
        name='ios-plus-empty'
        //name={ (this.state.selected) ? 'check-box' : 'check-box-outline-blank' }
        size={ 30 }
        color='#2CB673'
      />
    );
  },

  render() {
    var image_url = this.props.searchUser.image_url;
    if(_.isEmpty(image_url)) {
      image_url = constants.siteurl + '/img/user-profile-icon.png';
    }
    return (
      <TouchableHighlight
        underlayColor='rgba(0,0,0,.1)'
        onPress={ this.onSelect }
      >
        <View style={ styles.container }>
          <Image
            style={ styles.image }
            source={{ uri: image_url }}
          />
          <View style={ styles.details }>
            <Text style={ styles.name }>
              { this.props.searchUser.displayName }
            </Text>
            { this._renderIcon() }
          </View>
        </View>
      </TouchableHighlight>
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
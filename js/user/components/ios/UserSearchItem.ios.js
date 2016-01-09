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

var _ = require('underscore');
var constants = require('./../../../constants');
var resizeImage = require('./../../../shared/helpers/resizeImage');

var UserSearchItem = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    onSelect: React.PropTypes.func,
    selected: React.PropTypes.bool,
    showIcon: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
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
    this.props.onSelect(this.props.user);
    this.setState({
      selected: !this.state.selected
    });
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
    var userImageURL = (_.isEmpty(this.props.user.image))
      ? constants.siteurl + '/img/user-profile-icon.png'
      : resizeImage(this.props.user.image, 64, 64).url;

    console.log(this.props.selected)

    if(this.props.selected) {
      return <View/>;
    }

    return (
      <TouchableHighlight
        underlayColor='rgba(0,0,0,.1)'
        onPress={ this.onSelect }
      >
        <View style={ styles.container }>
          <Image
            style={ styles.image }
            source={{ uri: userImageURL }}
          />
          <View style={ styles.details }>
            <Text style={ styles.name }>
              { this.props.user.displayName }
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
    height: 60,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10
  },
  details: {
    height: 60,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#EEE',
    borderBottomWidth: 1
  },
  name: {
    flex: 1,
    color: '#282828',
    fontSize: 17
  }
});

module.exports = UserSearchItem;

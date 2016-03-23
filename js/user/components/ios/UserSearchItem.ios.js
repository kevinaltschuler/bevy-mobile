/**
 * UserSearchItem.ios.js
 *
 * Item for users in the directory view
 *
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
  TouchableOpacity,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');

var _ = require('underscore');
var constants = require('./../../../constants');
var resizeImage = require('./../../../shared/helpers/resizeImage');
var UserStore = require('./../../../user/UserStore');

var UserSearchItem = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    onSelect: React.PropTypes.func,
    showIcon: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      onSelect: _.noop,
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

  renderIcon() {
    if(!this.props.showIcon) return <View />;
    return (
      <Icon
        name='add'
        size={ 30 }
        color='#2CB673'
      />
    );
  },

  renderBigName() {
    var text;
    if(_.isEmpty(this.props.user.fullName)) {
      text = this.props.user.username;
    } else {
      text = this.props.user.fullName;
    }
    return (
      <Text
        style={ styles.bigName }
        numberOfLines={ 1 }
      >
        { text }
      </Text>
    );
  },

  renderSmallName() {
    if(_.isEmpty(this.props.user.fullName)) return <View />;
    return (
      <Text
        style={ styles.smallName }
        numberOfLines={ 1 }
      >
        { this.props.user.username }
      </Text>
    );
  },

  renderTitle() {
    if(_.isEmpty(this.props.user.title)) return <View />;
    return (
      <Text
        style={ styles.title }
        numberOfLines={ 1 }
      >
        { this.props.user.title }
      </Text>
    );
  },

  render() {
    var userImageURL = resizeImage(this.props.user.image, 64, 64).url;

    return (
      <TouchableOpacity
        activeOpacity={ 0.5 }
        onPress={ this.onSelect }
      >
        <View style={ styles.container }>
          <Image
            style={ styles.image }
            source={{ uri: userImageURL }}
          />
          <View style={ styles.details }>
            { this.renderBigName() }
            { this.renderSmallName() }
            { this.renderTitle() }
          </View>
        </View>
      </TouchableOpacity>
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
    borderBottomColor: '#EEE',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 10
  },
  details: {
    height: 60,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  bigName: {
    color: '#333',
    fontSize: 17
  },
  smallName: {
    color: '#666',
    fontSize: 15
  },
  title: {
    color: '#888',
    fontSize: 14
  }
});

module.exports = UserSearchItem;

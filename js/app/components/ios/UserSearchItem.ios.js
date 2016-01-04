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
var routes = require('./../../../routes.js');

var _ = require('underscore');
var constants = require('./../../../constants');

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
    var route = routes.MAIN.PROFILE;
    route.profileUser = this.props.searchUser;
    this.props.mainNavigator.push(route);
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

    alignItems: 'center'
    
  },
  name: {
    flex: 1,
    fontSize: 17,
    color: '#000'
  }
});

module.exports = UserSearchItem;

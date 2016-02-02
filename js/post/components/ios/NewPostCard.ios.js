/**
 * NewPostCard.ios.js
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  AlertIOS,
  TouchableOpacity
} = React;

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var resizeImage = require('./../../../shared/helpers/resizeImage');
var UserStore = require('./../../../user/UserStore');

var NewPostCard = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    activeBevy: React.PropTypes.object,
    mainNavigator: React.PropTypes.object
  },

  getInitialState() {
    return {
      hintText: constants.hintTexts[Math.floor(Math.random() * constants.hintTexts.length)],
      joined: _.contains(this.props.user.bevies, this.props.activeBevy._id)
    }
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      joined: _.contains(nextProps.user.bevies, nextProps.activeBevy._id)
    })
  },

  goToNewPost() {
    if(!this.state.joined) {
      // don't let a user that isnt a part of this bevy post
      AlertIOS.alert('You must join this bevy to post');
      return;
    }

    var route = {
      name: routes.MAIN.NEWPOST
    };
    this.props.mainNavigator.push(route);
  },

  render() {
    var userImageSource = UserStore.getUserImage(this.props.user.image, 64, 64);

    return (
      <TouchableOpacity
        activeOpacity={ 0.5 }
        onPress={ this.goToNewPost }
        style={ styles.touchContainer }
      >
        <View style={ styles.container }>
          <Image
            source={ userImageSource }
            style={ styles.image }
          />
          <View style={ styles.textContainer }>
            <Text style={ styles.text }>
              { this.state.hintText }
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    height: 60,
    paddingHorizontal: 10,
    borderRadius: 3,
    marginBottom: 15
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
    //borderBottomWidth: StyleSheet.hairlineWidth,
    //borderBottomColor: '#CCC'
  },
  text: {
    color: '#888',
    fontSize: 17
  }
});

module.exports = NewPostCard;

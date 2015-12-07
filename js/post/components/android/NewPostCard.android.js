/**
 * NewPostCard.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Image,
  TouchableNativeFeedback,
  ToastAndroid,
  StyleSheet
} = React;

var _ = require('underscore');
var constants = require('./../../../constants');
var UserStore = require('./../../../user/UserStore');
var routes = require('./../../../routes');

var NewPostCard = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    loggedIn: React.PropTypes.bool,
    mainNavigator: React.PropTypes.object
  },

  goToNewPost() {
    if(this.props.loggedIn) {
      this.props.mainNavigator.push(routes.MAIN.NEWPOST);
    } else {
      ToastAndroid.show('Please Log In to Post', ToastAndroid.SHORT);
    }
  },

  render() {
    return (
      <TouchableNativeFeedback
        background={ TouchableNativeFeedback.Ripple('#EEE', false) }
        onPress={ this.goToNewPost }
      >
        <View style={ styles.container }>
          <Image
            source={ UserStore.getUserImage(this.props.user, 30, 30) }
            style={ styles.userImage }
          />
          <Text style={ styles.promptText }>
            Drop a Line
          </Text>
        </View>
      </TouchableNativeFeedback>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 14,
    paddingLeft: 10,
    paddingRight: 10,
    elevation: 2
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10
  },
  promptText: {
    color: '#000'
  }
});

module.exports = NewPostCard;
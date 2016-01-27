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
  TouchableOpacity
} = React;

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var resizeImage = require('./../../../shared/helpers/resizeImage');

var hintTexts = [
  "What's on your mind?",
  "What's up?",
  "How's it going?",
  "What's new?",
  "How are you doing today?",
  "Share your thoughts",
  "Drop some knowledge buddy",
  "Drop a line",
  "What's good?",
  "What do you have to say?",
  "Spit a verse",
  "What would your mother think?",
  "Tell me about yourself",
  "What are you thinking about?",
  "Gimme a bar",
  "Lets talk about our feelings",
  "Tell me how you really feel",
  "How was last night?",
  "What's gucci?",
  "Anything worth sharing?",
];

var NewPostCard = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    mainNavigator: React.PropTypes.object
  },

  getInitialState() {
    return {
      hintText: hintTexts[Math.floor(Math.random() * hintTexts.length)]
    }
  },

  goToNewPost() {
    var route = {
      name: routes.MAIN.NEWPOST
    };
    this.props.mainNavigator.push(route);
  },

  render() {
    var userImageURL = (!_.isEmpty(this.props.user.image))
      ? resizeImage(this.props.user.image, 64, 64).url
      : constants.siteurl + '/img/user-profile-icon.png';

    return (
      <TouchableOpacity
        activeOpacity={ 0.5 }
        onPress={ this.goToNewPost }
        style={ styles.touchContainer }
      >
        <View style={ styles.container }>
          <Image
            source={{ uri: userImageURL }}
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
    //borderBottomWidth: 1,
    //borderBottomColor: '#ccc'
  },
  text: {
    color: '#888',
    fontSize: 17
  }
});

module.exports = NewPostCard;

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
  TouchableHighlight
} = React;

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var resizeImage = require('./../../../shared/helpers/resizeImage');

var NewPostCard = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    mainNavigator: React.PropTypes.object
  },

  render() {
    var userImageURL = (!_.isEmpty(this.props.user.image))
    ? resizeImage(this.props.user.image, 64, 64).url
    : constants.siteurl + '/img/user-profile-icon.png';

    return (
      <TouchableHighlight
        underlayColor={'rgba(0,0,0,0)'}
        onPress={() => {
          this.props.mainNavigator.push(routes.MAIN.NEWPOST);
        }}
        style={ styles.touchContainer }
      >
        <View style={ styles.container }>
          <Image
            source={{ uri: userImageURL }}
            style={ styles.image }
          />
          <View style={ styles.textContainer }>
            <Text style={ styles.text }>
              Drop a Line
            </Text>
          </View>
        </View>
      </TouchableHighlight>
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
    padding: 10,
    borderRadius: 3,
    marginBottom: 15
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 15
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
    //borderBottomWidth: 1,
    //borderBottomColor: '#ccc'
  },
  text: {
    color: '#aaa'
  }
});

module.exports = NewPostCard;

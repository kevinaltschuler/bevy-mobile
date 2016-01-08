'use strict';

var React = require('react-native');
var {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight
} = React;
var Icon = require('react-native-vector-icons/Ionicons');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');

var NewPostCard = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    loggedIn: React.PropTypes.bool,
    mainNavigator: React.PropTypes.object
  },

  render() {

    var image_url = (this.props.loggedIn && !_.isEmpty(this.props.user.image_url))
    ? this.props.user.image_url
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
            source={{ uri: image_url }}
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
  touchContainer: {
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    borderRadius: 3,
    marginBottom: 10
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

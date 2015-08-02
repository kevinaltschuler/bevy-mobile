'use strict';

var React = require('react-native');
var {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight
} = React;
var {
  Icon
} = require('react-native-icons');

var constants = require('./../../constants');
var routes = require('./../../routes');

var NewPostCard = React.createClass({

  propTypes: {
    user: React.PropTypes.object,
    loggedIn: React.PropTypes.bool,
    mainNavigator: React.PropTypes.object,
    authModalActions: React.PropTypes.object
  },

  render() {

    var image_url = (this.props.loggedIn)
    ? this.props.user.image_url
    : constants.siteurl + '/img/user-profile-icon.png';

    return (
      <TouchableHighlight
        underlayColor={'rgba(0,0,0,0)'}
        onPress={() => {
          if(this.props.loggedIn)
            this.props.mainNavigator.push(routes.MAIN.NEWPOST);
          else
            this.props.authModalActions.open('Log In To Post');
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
    shadowColor: 'black',
    shadowRadius: 1,
    shadowOpacity: .3,
    shadowOffset:  {width: 0, height: 0}
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: -10,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    borderRadius: 3
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
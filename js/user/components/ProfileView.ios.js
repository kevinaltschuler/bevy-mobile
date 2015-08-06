'use strict';

var React = require('react-native');
var {
  View,
  Image,
  Text,
  TouchableHighlight,
  StyleSheet
} = React;
var {
  Icon
} = require('react-native-icons');

var Navbar = require('./../../shared/components/Navbar.ios.js');
var PostList = require('./../../post/components/PostList.ios.js');

var constants = require('./../../constants');
var POST = constants.POST;
var PostActions = require('./../../post/PostActions');
var PostStore = require('./../../post/PostStore');
var StatusBarSizeIOS = require('react-native-status-bar-size');

var ProfileView = React.createClass({

  propTypes: {
    mainNavigator: React.PropTypes.object,
    user: React.PropTypes.object,
    profileUser: React.PropTypes.object
  },

  getInitialState() {
    return {

    };
  },

  render() {
    return (
      <View style={ styles.container }>
        <Navbar 
          styleParent={{
            backgroundColor: '#2CB673',
            flexDirection: 'column',
            paddingTop: 0
          }}
          styleBottom={{
            backgroundColor: '#2CB673',
            height: 48,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
          left={
            <TouchableHighlight
              underlayColor={'rgba(0,0,0,0)'}
              onPress={() => {
                this.props.mainNavigator.pop();
              }}
              style={ styles.navButtonLeft }>
              <Text style={ styles.navButtonTextLeft }>
                Back
              </Text>
            </TouchableHighlight>
          }
          center={
            <View style={ styles.navTitle }>
              <Text style={ styles.navTitleText }>
                { this.props.profileUser.displayName }'s Profile
              </Text>
            </View>
          }
          right={ <View /> }
        />

        <View style={ styles.body }>

          <View style={ styles.profileCard }>
            <Image 
              source={{ uri: this.props.profileUser.image_url }}
              style={ styles.profileImage }
            />
            <View style={ styles.profileDetails }>
              <Text style={ styles.profileName }>{ this.props.profileUser.displayName }</Text>
              <Text style={ styles.profileEmail }>{ this.props.profileUser.email }</Text>
            </View>
          </View>

          <PostList { ...this.props } />

        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },

  navButtonLeft: {
    flex: 1
  },
  navButtonTextLeft: {
    color: '#ddd',
    fontSize: 17
  },
  navTitle: {
    flex: 2
  },
  navTitleText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center'
  },

  body: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#eee'
  },

  profileCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 10,
    margin: 10,
    borderRadius: 2,
    shadowColor: 'black',
    shadowRadius: 1,
    shadowOpacity: .3,
    shadowOffset:  {width: 0, height: 0}
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10
  },
  profileDetails: {
    flex: 1,
    flexDirection: 'column'
  },
  profileName: {
    color: '#333', 
    fontSize: 15
  },
  profileEmail: {
    color: '#666', 
    fontSize: 12
  },
});

module.exports = ProfileView;
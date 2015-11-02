'use strict';

var React = require('react-native');
var {
  View,
  Image,
  Text,
  TouchableHighlight,
  StyleSheet,
  ScrollView
} = React;

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
    profileUser: React.PropTypes.object,
    activeBevy: React.PropTypes.object
  },

  getInitialState() {
    return {

    };
  },

  componentDidMount() {
    // get user posts
    PostActions.fetch(
      this.props.activeBevy._id, 
      this.props.profileUser._id
    );
  },

  componentWillUnmount() {
    // reset posts
    PostActions.fetch(
      this.props.activeBevy, 
      null
    );
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

        <ScrollView>

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

            <Text style={styles.sectionTitle}>
              General
            </Text>

            <View style={styles.generalItem}>
              <Text style={styles.generalTitle}>
                points
              </Text>
              <Text style={styles.generalText}>
                {this.props.user.points}
              </Text>
            </View>  

            <View style={styles.generalItem}>
              <Text style={styles.generalTitle}>
                comments
              </Text>
              <Text style={styles.generalText}>
                {this.props.user.commentCount}
              </Text>
            </View>

            <View style={styles.generalItem}>
              <Text style={styles.generalTitle}>
                posts
              </Text>
              <Text style={styles.generalText}>
                {this.props.user.postCount}
              </Text>
            </View>

            <Text style={styles.sectionTitle}>
              Posts
            </Text>

            <PostList 
              showNewPostCard={ false }
              profileUser={ this.props.profileUser }
              onScroll={() => {}}
              { ...this.props } 
            />

          </View>
        </ScrollView>
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
    flex: 1,
    padding: 10
  },
  navButtonTextLeft: {
    color: '#fff',
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
    shadowColor: '#000',
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
  generalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 48,
    borderWidth: .5,
    borderColor: 'rgba(0,0,0,.2)',
    backgroundColor: '#fff'
  },
  generalTitle: {
    color: '#666'
  },
  generalText: {
    color: '#666'
  },
  sectionTitle: {
    color: '#666',
    marginLeft: 15,
    marginVertical: 10,
    fontWeight: 'bold'
  }
});

module.exports = ProfileView;
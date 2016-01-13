 /**
 * ProfileView.ios.js
 * @author albert
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  Image,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} = React;
var PostList = require('./../../../post/components/ios/PostList.ios.js');
var Icon = require('react-native-vector-icons/MaterialIcons');

var _ = require('underscore');
var constants = require('./../../../constants');
var resizeImage = require('./../../../shared/helpers/resizeImage');
var POST = constants.POST;
var PostActions = require('./../../../post/PostActions');
var PostStore = require('./../../../post/PostStore');

var ProfileView = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    user: React.PropTypes.object,
    profileUser: React.PropTypes.object,
    activeBevy: React.PropTypes.object
  },

  componentDidMount() {
    // get user posts
    setTimeout(() => {
      PostActions.fetch(null, this.props.profileUser._id);
    }, 100);
  },
  componentWillUnmount() {
    // reset posts
    PostActions.fetch(this.props.activeBevy._id, null);
  },

  goBack() {
    this.props.mainNavigator.pop();
    // reset posts
    PostActions.fetch(this.props.activeBevy._id, null);
  },

  render() {
    var userImageURL = (_.isEmpty(this.props.profileUser.image))
      ? constants.siteurl + '/img/user-profile-icon.png'
      : resizeImage(this.props.profileUser.image, 64, 64).url;

    return (
      <View style={ styles.container }>
        <View style={ styles.topBarContainer }>
          <View style={{
            height: constants.getStatusBarHeight(),
            backgroundColor: '#2CB673'
          }}/>
          <View style={ styles.topBar }>
            <TouchableOpacity
              activeOpacity={ 0.5 }
              style={ styles.iconButton }
              onPress={ this.goBack }
            >
              <Icon
                name='arrow-back'
                size={ 30 }
                color='#FFF'
              />
            </TouchableOpacity>
            <Text style={ styles.title }>
              { this.props.profileUser.displayName }'s Profile
            </Text>
            <View style={{
              width: 48,
              height: 48
            }}/>
          </View>
        </View>

        <ScrollView
          style={ styles.scrollView }
          automaticallyAdjustContentInsets={ false }
        >
          <View style={ styles.body }>
            <View style={ styles.profileCard }>
              <Image
                source={{ uri: userImageURL }}
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
              <View style={styles.itemInner}>
                <Text style={styles.generalTitle}>
                  Points
                </Text>
                <Text style={styles.generalText}>
                  {this.props.user.points}
                </Text>
              </View>
            </View>

            <View style={styles.generalItem}>
              <View style={styles.itemInner}>
                <Text style={styles.generalTitle}>
                  Comments
                </Text>
                <Text style={styles.generalText}>
                  {this.props.user.commentCount}
                </Text>
              </View>
            </View>

            <View style={styles.generalItem}>
              <View style={styles.itemInner}>
                <Text style={styles.generalTitle}>
                  Posts
                </Text>
                <Text style={styles.generalText}>
                  {this.props.user.postCount}
                </Text>
              </View>
            </View>

            <Text style={styles.postsTitle}>
              Posts
            </Text>
            <PostList
              showNewPostCard={ false }
              profileUser={ (_.isEmpty(this.props.profileUser))
                ? this.props.user
                : this.props.profileUser }
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
    flexDirection: 'column',
    backgroundColor: '#eee'
  },
  topBarContainer: {
    flexDirection: 'column',
    paddingTop: 0,
    overflow: 'visible',
    backgroundColor: '#2CB673'
  },
  topBar: {
    height: 48,
    backgroundColor: '#2CB673',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 17,
    textAlign: 'center',
    color: '#FFF'
  },
  iconButton: {
    width: 48,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

  body: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#eee',
    minHeight: constants.height
  },

  profileCard: {
    height: 80,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10
  },
  profileDetails: {
    flex: 1,
    flexDirection: 'column'
  },
  profileName: {
    color: '#333',
    fontSize: 17
  },
  profileEmail: {
    color: '#666',
    fontSize: 15
  },
  generalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    backgroundColor: '#fff'
  },
  generalTitle: {
    color: '#666',
    backgroundColor: '#fff',
    fontSize: 17
  },
  generalText: {
    color: '#666',
    backgroundColor: '#fff',
    fontSize: 17
  },
  itemInner: {
    height: 48,
    width: constants.width,
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: '#666',
    fontSize: 17,
    marginLeft: 15,
    marginVertical: 10,
  },
  postsTitle: {
    color: '#666',
    fontSize: 17,
    marginLeft: 15,
    marginTop: 15,
    marginBottom: 5,
  }
});

module.exports = ProfileView;

/**
 * ProfileView.ios.js
 *
 * View to see someone's profile info and their posts
 * also has a nifty link to message them
 *
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
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ScrollView
} = React;
var PostList = require('./../../../post/components/ios/PostList.ios.js');
var ImageOverlay = require('./../../../post/components/ios/ImageOverlay.ios.js');
var Icon = require('react-native-vector-icons/MaterialIcons');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var resizeImage = require('./../../../shared/helpers/resizeImage');
var timeAgo = require('./../../../shared/helpers/timeAgo');
var PostActions = require('./../../../post/PostActions');
var PostStore = require('./../../../post/PostStore');
var UserStore = require('./../../../user/UserStore');
var UserActions = require('./../../../user/UserActions');
var POST = constants.POST;
var USER = constants.USER;

var ProfileView = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    user: React.PropTypes.object,
    profileUser: React.PropTypes.object,
    activeBevy: React.PropTypes.object
  },

  getInitialState() {
    return {
      refreshing: false,
      image: this.props.profileUser.image,
      displayName: this.props.profileUser.displayName,
      email: (_.isEmpty(this.props.profileUser.email))
        ? 'No Email' : this.props.profileUser.email,
      title: this.props.profileUser.title,
      phoneNumber: this.props.profileUser.phoneNumber,
      points: this.props.profileUser.points,
      postCount: this.props.profileUser.postCount,
      commentCount: this.props.profileUser.commentCount,
      showImageOverlay: false
    };
  },

  componentDidMount() {
    UserStore.on(USER.LOADING, this.onLoading);
    UserStore.on(USER.LOADED, this.onLoaded);
    // get user posts
    setTimeout(() => {
      PostActions.fetch(null, this.props.profileUser._id);
      this.onRefresh();
    }, 100);
  },
  componentWillUnmount() {
    UserStore.off(USER.LOADING, this.onLoading);
    UserStore.off(USER.LOADED, this.onLoaded);
    // reset posts
    PostActions.fetch(this.props.activeBevy._id, null);
  },

  onLoading() {
    this.setState({ refreshing: true });
  },
  onLoaded(newUser) {
    this.setState({
      refreshing: false,
      image: newUser.image,
      displayName: newUser.displayName,
      email: (_.isEmpty(newUser.email))
        ? 'No Email' : newUser.email,
      title: newUser.title,
      phoneNumber: newUser.phoneNumber,
      points: newUser.points,
      postCount: newUser.postCount,
      commentCount: newUser.commentCount
    });
  },
  onRefresh() {
    UserActions.fetch(this.props.profileUser._id);
  },

  goBack() {
    this.props.mainNavigator.pop();
  },

  goToSettings() {
    this.props.mainNavigator.push({ name: routes.MAIN.SETTINGSVIEW });
  },

  showOverlay() {
    this.setState({ showImageOverlay: true });
  },
  hideOverlay() {
    this.setState({ showImageOverlay: false });
  },

  goToNewThread() {
    // go to new thread view
    var route = {
      name: routes.MAIN.NEWTHREAD,
      defaultUser: this.props.profileUser
    };
    this.props.mainNavigator.push(route);
  },

  renderEditButton() {
    if(this.props.user._id == this.props.profileUser._id) {
      return (
        <TouchableOpacity
          activeOpacity={ 0.5 }
          style={ styles.iconButton }
          onPress={ this.goToSettings }
        >
          <Icon
            name='edit'
            size={ 30 }
            color='#FFF'
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={{ width: 48, height: 48 }} />
      );
    }
  },

  _renderSeparator() {
    return (
      <View style={{
        width: constants.width,
        height: StyleSheet.hairlineWidth,
        flexDirection: 'row'
      }}>
        <View style={{
          width: 30 + 36,
          height: StyleSheet.hairlineWidth,
          backgroundColor: '#FFF'
        }}/>
        <View style={{
          flex: 1,
          height: StyleSheet.hairlineWidth,
          backgroundColor: '#EEE'
        }}/>
      </View>
    );
  },

  render() {
    var userImageSource = (_.isEmpty(this.state.image))
      ? require('./../../../images/user-profile-icon.png')
      : { uri: resizeImage(this.state.image, 64, 64).url };

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
              {(this.props.profileUser._id == this.props.user._id)
                ? 'My Profile' : `${this.props.profileUser.displayName}'s Profile`}
            </Text>
            { this.renderEditButton() }
          </View>
        </View>

        <ScrollView
          style={ styles.scrollView }
          automaticallyAdjustContentInsets={ false }
          refreshControl={
            <RefreshControl
              refreshing={ this.state.refreshing }
              onRefresh={ this.onRefresh }
              tintColor='#AAA'
            />
          }
        >
          <View style={ styles.body }>
            <View style={ styles.profileCard }>
              <TouchableOpacity
                activeOpacity={ 0.5 }
                onPress={ this.showOverlay }
              >
                <Image
                  source={ userImageSource }
                  style={ styles.profileImage }
                />
              </TouchableOpacity>
              <View style={ styles.profileDetails }>
                <Text style={ styles.profileName }>
                  { this.state.displayName }
                </Text>
                <Text style={ styles.profileEmail }>
                  { this.state.email }
                </Text>
                <Text style={ styles.profileTitle }>
                  { this.state.title }
                </Text>
              </View>

              <ImageOverlay
                images={[ this.state.image ]}
                isVisible={ this.state.showImageOverlay }
                title={ this.state.displayName }
                onHide={ this.hideOverlay }
              />
            </View>

            <Text style={ styles.sectionTitle }>
              General
            </Text>

            <View style={ styles.generalItem }>
              <View style={ styles.itemInner }>
                <Icon
                  name='contact-phone'
                  size={ 30 }
                  color='#AAA'
                  style={ styles.itemIcon }
                />
                <Text style={ styles.generalTitle }>
                  Phone Number
                </Text>
                <Text style={ styles.generalText }>
                  { this.state.phoneNumber }
                </Text>
              </View>
            </View>
            { this._renderSeparator() }
            <View style={ styles.generalItem }>
              <View style={ styles.itemInner }>
                <Icon
                  name='access-time'
                  size={ 30 }
                  color='#AAA'
                  style={ styles.itemIcon }
                />
                <Text style={ styles.generalTitle }>
                  Joined
                </Text>
                <Text style={ styles.generalText }>
                  { timeAgo(Date.parse(this.props.profileUser.created)) }
                </Text>
              </View>
            </View>
            { this._renderSeparator() }
            <View style={ styles.generalItem }>
              <View style={ styles.itemInner }>
                <Icon
                  name='thumb-up'
                  size={ 30 }
                  color='#AAA'
                  style={ styles.itemIcon }
                />
                <Text style={ styles.generalTitle }>
                  Points
                </Text>
                <Text style={ styles.generalText }>
                  { this.state.points }
                </Text>
              </View>
            </View>
            { this._renderSeparator() }
            <View style={ styles.generalItem }>
              <View style={ styles.itemInner }>
                <Icon
                  name='comment'
                  size={ 30 }
                  color='#AAA'
                  style={ styles.itemIcon }
                />
                <Text style={ styles.generalTitle }>
                  Comments
                </Text>
                <Text style={ styles.generalText }>
                  { this.state.commentCount }
                </Text>
              </View>
            </View>
            { this._renderSeparator() }
            <View style={ styles.generalItem }>
              <View style={ styles.itemInner }>
                <Icon
                  name='description'
                  size={ 30 }
                  color='#AAA'
                  style={ styles.itemIcon }
                />
                <Text style={ styles.generalTitle }>
                  Posts
                </Text>
                <Text style={ styles.generalText }>
                  { this.state.postCount }
                </Text>
              </View>
            </View>

            <Text style={ styles.postsTitle }>
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
    backgroundColor: '#eee'
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
    borderRadius: 6,
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
  profileTitle: {
    color: '#666',
    fontSize: 15
  },
  generalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    backgroundColor: '#fff',
    paddingHorizontal: 20
  },
  generalTitle: {
    flex: 1,
    color: '#444',
    textAlign: 'left',
    fontSize: 17
  },
  generalText: {
    color: '#666',
    backgroundColor: '#fff',
    fontSize: 17,
  },
  itemInner: {
    height: 60,
    width: constants.width,
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  itemIcon: {
    marginRight: 20
  },
  sectionTitle: {
    color: '#AAA',
    fontSize: 17,
    marginLeft: 15,
    marginVertical: 10,
  },
  postsTitle: {
    color: '#AAA',
    fontSize: 17,
    marginLeft: 15,
    marginTop: 15,
    marginBottom: 5,
  }
});

module.exports = ProfileView;

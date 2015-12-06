/**
 * PublicProfileView.android.js
 * @author albert
 */

'use strict';

var React = require('react-native');
var {
  View,
  ScrollView,
  Text,
  TouchableNativeFeedback,
  BackAndroid,
  StyleSheet
} = React;
var Icon = require('./../../../shared/components/android/Icon.android.js');
var PostList = require('./../../../post/components/android/PostList.android.js');
var ProfileRow = require('./ProfileRow.android.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var PostActions = require('./../../../post/PostActions');
var ChatActions = require('./../../../chat/ChatActions');
var ChatStore = require('./../../../chat/ChatStore');
var CHAT = constants.CHAT;

var PublicProfileView = React.createClass({
  propTypes: {
    mainNavigator: React.PropTypes.object,
    user: React.PropTypes.object,
    routeUser: React.PropTypes.object,
    activeBevy: React.PropTypes.object
  },

  componentDidMount() {
    // get user posts
    PostActions.fetch(
      null,
      this.props.routeUser._id
    );
    BackAndroid.addEventListener('hardwareBackPress', this.onBackButton);
    ChatStore.on(CHAT.SWITCH_TO_THREAD, this.onSwitchToThread);
  },
  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.onBackButton);
    ChatStore.off(CHAT.SWITCH_TO_THREAD, this.onSwitchToThread);
    // reset posts
    PostActions.fetch(this.props.activeBevy._id);
  },

  onBackButton() {
    this.props.mainNavigator.pop();
    return true;
  },

  goBack() {
    // go back
    this.props.mainNavigator.pop();
  },

  onSwitchToThread(thread_id) {
    this.props.mainNavigator.push(routes.MAIN.MESSAGEVIEW);
  },

  messageUser() {
    ChatActions.startPM(this.props.routeUser._id);
  },

  _renderTopBar() {
    var userName = (this.props.user._id == this.props.routeUser._id)
      ? 'Your'
      : this.props.routeUser.displayName + "'s";
    return (
      <View style={ styles.topBar }>
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#62D487', false) }
          onPress={ this.goBack }
        >
          <View style={ styles.backButton }>
            <Icon
              name='arrow-back'
              size={ 30 }
              color='#FFF'
            />
          </View>
        </TouchableNativeFeedback>
        <Text style={ styles.titleText }>
          { userName } Public Profile
        </Text>
      </View>
    );
  },

  _renderActions() {
    // dont render this for yourself
    if(this.props.user._id == this.props.routeUser._id) return <View />;
    return (
      <View>
        <Text style={ styles.sectionTitle }>
          Actions
        </Text>
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#DDD', false) }
          onPress={ this.messageUser }
        >
          <View style={ styles.detailItem }>
            <Icon
              name='chat'
              size={ 30 }
              color='#AAA'
            />
            <Text style={[ styles.detailItemKey, {
              marginLeft: 10
            }]}>
              Message { this.props.routeUser.displayName }
            </Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  },

  render() {
    return (
      <View style={ styles.container }>
        { this._renderTopBar() }
        <ScrollView style={ styles.list }>
          <ProfileRow
            big={ true }
            user={ this.props.routeUser }
            nameColor='#666'
            emailColor='#666'
            style={ styles.profileRow }
          />
          <Text style={ styles.sectionTitle }>
            General
          </Text>
          <View style={ styles.detailItem }>
            <Text style={ styles.detailItemKey }>
              Points
            </Text>
            <Text style={ styles.detailItemValue }>
              { this.props.routeUser.points }
            </Text>
          </View>
          <View style={ styles.detailItem }>
            <Text style={ styles.detailItemKey }>
              Posts
            </Text>
            <Text style={ styles.detailItemValue }>
              { this.props.routeUser.postCount }
            </Text>
          </View>
          <View style={ styles.detailItem }>
            <Text style={ styles.detailItemKey }>
              Comments
            </Text>
            <Text style={ styles.detailItemValue }>
              { this.props.routeUser.commentCount }
            </Text>
          </View>
          { this._renderActions() }
          <Text style={ styles.sectionTitle }>Posts</Text>
          <PostList
            allPosts={ this.props.allPosts }
            activeBevy={ this.props.activeBevy }
            user={ this.props.user }
            loggedIn={ this.props.loggedIn }
            mainNavigator={ this.props.mainNavigator }
            mainRoute={ this.props.mainRoute }
            showNewPostCard={ false }
            renderHeader={ false }
          />
        </ScrollView>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE'
  },
  topBar: {
    backgroundColor: '#2CB673',
    height: 48,
    width: constants.width,
    flexDirection: 'row',
    alignItems: 'center'
  },
  backButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginRight: 10
  },
  titleText: {
    flex: 1,
    color: '#FFF',
    textAlign: 'left',
    fontSize: 18
  },
  list: {
    flex: 1,
    paddingTop: 10
  },
  profileRow: {
    backgroundColor: '#FFF',
    marginTop: 10
  },
  sectionTitle: {
    marginTop: 10,
    marginBottom: 4,
    marginLeft: 10,
    color: '#AAA'
  },
  detailItem: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    borderBottomColor: '#EEE',
    borderBottomWidth: 1
  },
  detailItemKey: {
    flex: 1
  },
  detailItemValue: {

  }
});

module.exports = PublicProfileView;
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
var Icon = require('react-native-vector-icons/MaterialIcons');
var PostList = require('./../../../post/components/android/PostList.android.js');
var ProfileRow = require('./ProfileRow.android.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var PostActions = require('./../../../post/PostActions');

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
      this.props.activeBevy, 
      this.props.routeUser._id
    );
    BackAndroid.addEventListener('hardwareBackPress', this.onBackButton);
  },
  componentWillUnmount() {
    // reset posts
    PostActions.fetch(
      this.props.activeBevy, 
      null
    );
    BackAndroid.removeEventListener('hardwareBackPress', this.onBackButton);
  },

  onBackButton() {
    this.props.mainNavigator.pop();
    return true;
  },

  goBack() {
    // go back
    this.props.mainNavigator.pop();
  },

  _renderTopBar() {
    var userName = (this.props.user._id == this.props.routeUser._id)
      ? 'Your'
      : this.props.routeUser.displayName + "'s";
    return (
      <View style={ styles.topBar }>
        <TouchableNativeFeedback
          background={ TouchableNativeFeedback.Ripple('#EEE', false) }
          onPress={ this.goBack }
        >
          <View style={ styles.backButton }>
            <Icon
              name='arrow-back'
              size={ 30 }
              color='#888'
            />
          </View>
        </TouchableNativeFeedback>
        <View style={{ flex: 1 }} />
        <View style={ styles.titleContainer }>
          <Text style={ styles.titleText }>
            { userName } Public Profile
          </Text>
        </View>
      </View>
    );
  },

  render() {
    return (
      <View style={ styles.container }>
        { this._renderTopBar() }
        <ScrollView style={ styles.list }>
          <ProfileRow
            user={ this.props.routeUser }
            nameColor='#666'
            emailColor='#666'
            style={ styles.profileRow }
          />
          <Text style={ styles.sectionTitle }>General</Text>
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
    backgroundColor: '#FFF',
    height: 48,
    width: constants.width,
    flexDirection: 'row',
    alignItems: 'center'
  },
  backButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8
  },
  titleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: constants.width,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30
  },
  titleText: {
    color: '#666'
  },
  list: {
    flex: 1
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
    paddingHorizontal: 10
  },
  detailItemKey: {
    flex: 1
  },
  detailItemValue: {

  }
});

module.exports = PublicProfileView;
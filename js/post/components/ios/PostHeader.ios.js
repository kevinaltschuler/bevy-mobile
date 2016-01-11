/**
 * PostHeader.ios.js
 * @author albert
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActionSheetIOS,
  StyleSheet
} = React;
var Icon = require('react-native-vector-icons/MaterialIcons');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var timeAgo = require('./../../../shared/helpers/timeAgo')
var resizeImage = require('./../../../shared/helpers/resizeImage');

var PostHeader = React.createClass({
  propTypes: {
    post: React.PropTypes.object,
    user: React.PropTypes.object,
    mainNavigator: React.PropTypes.object
  },

  goToAuthorProfile() {
    var route = routes.MAIN.PROFILE;
    route.profileUser = this.props.post.author;
    this.props.mainNavigator.push(route);
  },

  showProfileActionSheet() {
    ActionSheetIOS.showActionSheetWithOptions({
      options: [
        'View ' + this.props.post.author.displayName + "'s Profile",
        'Cancel'
      ],
      cancelButtonIndex: 1
    }, buttonIndex => {
      if(buttonIndex == 0) {
        this.goToAuthorProfile();
      }
    });
  },

  render() {
    var authorImageURL = _.isEmpty(this.props.post.author.image)
      ? constants.siteurl + '/img/user-profile-icon.png'
      : resizeImage(this.props.post.author.image, 64, 64).url;

    return (
      <View style={ styles.container }>
        <TouchableOpacity
          activeOpacity={ 0.7 }
          onPress={ this.showProfileActionSheet }
        >
          <Image
            style={ styles.authorImage }
            source={{ uri: authorImageURL }}
          />
        </TouchableOpacity>
        <View style={ styles.detailsRow }>
          <View style={ styles.titleContainer }>
            <Text
              numberOfLines={ 1 }
              style={ styles.titleText }
            >
              { this.props.post.author.displayName }
            </Text>
            <Icon
              name='chevron-right'
              style={{ marginTop: 2 }}
              color='#333'
              size={ 16 }
            />
            <Text
              numberOfLines={ 1 }
              style={ styles.titleText }
            >
              { this.props.post.board.name }
            </Text>
          </View>
          <Text style={ styles.subTitleText }>
            { timeAgo(Date.parse(this.props.post.created)) }
          </Text>
        </View>
      </View>
    );
  }
});

var sideMargins = 10;
var cardWidth = constants.width - sideMargins * 2;

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: cardWidth,
    height: 60,
    paddingHorizontal: 10,
    alignItems: 'center'
  },
  authorImage: {
    width: 40,
    height: 40,
    backgroundColor: '#eee',
    borderRadius: 20,
    marginLeft: 0
  },
  detailsRow: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    height: 60,
    marginLeft: 10,
    alignItems: 'flex-start'
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleText: {
    color: '#282929',
    fontSize: 17
  },
  subTitleText: {
    fontSize: 15,
    color: '#666'
  },
});

module.exports = PostHeader;

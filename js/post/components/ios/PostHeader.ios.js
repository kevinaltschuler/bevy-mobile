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
var BoardActions = require('./../../../board/BoardActions');
var BevyActions = require('./../../../bevy/BevyActions');

var PostHeader = React.createClass({
  propTypes: {
    post: React.PropTypes.object,
    user: React.PropTypes.object,
    mainNavigator: React.PropTypes.object,
    mainRoute: React.PropTypes.object
  },

  goToAuthorProfile() {
    if(this.props.mainRoute.name == routes.MAIN.PROFILE.name
      && this.props.mainRoute.profileUser._id == this.props.post.author._id) {
      // we're already viewing the author's profile, do nothing
      return;
    }
    
    var route = routes.MAIN.PROFILE;
    route.profileUser = this.props.post.author;
    this.props.mainNavigator.push(route);
  },

  goToPostBoard() {
    //console.log(this.props.mainNavigator.getCurrentRoutes());

    if(this.props.mainRoute.name == routes.MAIN.BEVYNAV.name) {
      // already in bevy view, do nothing
    } else if (_.findWhere(this.props.mainNavigator.getCurrentRoutes(),
      { name: routes.MAIN.BEVYNAV.name }) != undefined) {
      // the bevy nav route is somewhere back in the route stack
      // so lets pop to it
      this.props.mainNavigator.popToRoute(routes.MAIN.BEVYNAV);
    } else {
      // the route isn't in the history, so push to it
      this.props.mainNavigator.push(routes.MAIN.BEVYNAV);
    }

    // switch bevies
    BevyActions.switchBevy(this.props.post.board.parent);
    // switch boards
    BoardActions.switchBoard(this.props.post.board._id);
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

  showBoardActionSheet() {
    ActionSheetIOS.showActionSheetWithOptions({
      options: [
        'View Board "' + this.props.post.board.name + '"',
        'Cancel'
      ],
      cancelButtonIndex: 1
    }, buttonIndex => {
      if(buttonIndex == 0) {
        this.goToPostBoard()
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
            <TouchableOpacity
              activeOpacity={ 0.5 }
              onPress={ this.showProfileActionSheet }
            >
              <Text
                numberOfLines={ 1 }
                style={ styles.titleText }
              >
                { this.props.post.author.displayName }
              </Text>
            </TouchableOpacity>
            <Icon
              name='chevron-right'
              style={{ marginTop: 2 }}
              color='#333'
              size={ 16 }
            />
            <TouchableOpacity
              activeOpacity={ 0.5 }
              onPress={ this.showBoardActionSheet }
            >
              <Text
                numberOfLines={ 1 }
                style={ styles.titleText }
              >
                { this.props.post.board.name }
              </Text>
            </TouchableOpacity>
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
    width: cardWidth - 20 - 40 - 10,
    marginLeft: 10,
    alignItems: 'flex-start'
  },
  titleContainer: {
    width: cardWidth - 20 - 40 - 10,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden'
  },
  titleText: {
    overflow: 'hidden',
    color: '#282929',
    fontSize: 17
  },
  subTitleText: {
    fontSize: 15,
    color: '#666'
  },
});

module.exports = PostHeader;

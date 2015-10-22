/**
 * Event.ios.js
 * kevin made this
 * i will never drink again
 */
 'use strict';

var React = require('react-native');
var _ = require('underscore');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight
} = React;
var Icon = require('react-native-vector-icons/Ionicons');
var ImageOverlay = require('./ImageOverlay.ios.js');
var PostActionList = require('./PostActionList.ios.js');
var Collapsible = require('react-native-collapsible');

var SettingsItem = require('./../../shared/components/SettingsItem.ios.js');

var constants = require('./../../constants');
var POST = constants.POST;
var routes = require('./../../routes');
var timeAgo = require('./../../shared/helpers/timeAgo');
var PostActions = require('./../PostActions');
var PostStore = require('./../PostStore');

var Event = React.createClass({
  propTypes: {
    mainRoute: React.PropTypes.object,
    mainNavigator: React.PropTypes.object,
    inCommentView: React.PropTypes.bool,
    post: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      inCommentView: false,
      post: {}
    };
  },

  getInitialState() {
    return {
      post: this.props.post,
      overlayVisible: false,
      voted: this.props.post.voted,
      collapsed: true
    };
  },

  componentDidMount() {
    PostStore.on(POST.CHANGE_ONE + this.props.post._id, () => {
      this.setState({
        post: PostStore.getPost(this.props.post._id)
      });
    });
  },

  componentWillUnmount() {
    PostStore.off(POST.CHANGE_ONE + this.props.post._id);
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      post: nextProps.post
    });
  },

  countVotes: function() {
    var sum = 0;
    this.state.post.votes.forEach(function(vote) {
      sum += vote.score;
    });
    return sum;
  },

  _renderPostTitle() {
    var date = new Date(this.state.post.event.date);
    if(_.isEmpty(this.state.post.title)) return null;
    return (
      <View style={styles.body}>

        <View style={styles.titleTextColumn}>
          <Text style={styles.descriptionText}>
            { this.state.post.event.description }
          </Text>
        </View>

        <SettingsItem 
          title={ 
            date.toLocaleDateString("en", {month: "short"}) + ", " + 
            date.toLocaleDateString("en", {day: "numeric"}) + ' ' + 
            date.toLocaleTimeString()
          }
          icon={<Icon size={30} name='calendar' />}
        />
        <SettingsItem 
          title={ this.state.post.event.location }
          icon={<Icon size={30} name='ios-location'/>}
          onPress={() => {
            var mapRoute = routes.MAIN.MAP;
            mapRoute.location = this.state.post.event.location;
            this.props.mainNavigator.push(mapRoute);
          }}
        />

        {/*<TouchableHighlight
          underlayColor='rgba(0,0,0,0.1)'
          onPress={() => {
            var mapRoute = routes.MAIN.MAP;
            mapRoute.location = this.state.post.event.location;
            this.props.mainNavigator.push(mapRoute);
        }}>
          <Text style={styles.eventDetail}>
            { this.state.post.event.location }
          </Text>
        </TouchableHighlight>*/}
      </View>
    );
  },

  _renderPostImage() {
    var imageURL = (_.isEmpty(this.state.post.images[0])) ? 'http://api.joinbevy.com/img/default_event_img.png' : this.state.post.images[0];
    return (
      <View style={{borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
        <Image
          style={ styles.postImage }
          source={{ uri: imageURL }}
          resizeMode='cover'
        >
          <Text style={styles.titleText}>
            { this.state.post.title }
          </Text>
        </Image>
      </View>
    );
  },

  render: function() {
    var post = this.state.post;

    return (
      <View style={ styles.eventCard}>
        { this._renderPostImage() }
        { this._renderPostTitle() }
      </View>
    );
  },
});

var sideMargins = 10;
var cardWidth = constants.width - sideMargins * 2;

var styles = StyleSheet.create({
  eventCard: {
    shadowColor: '#000',
    shadowRadius: 1,
    shadowOpacity: .3,
    shadowOffset:  {width: 0, height: 0},
    backgroundColor: '#fff'
  },

  titleRow: {
    flexDirection: 'row',
    width: cardWidth,
    paddingLeft: 8,
    paddingRight: 8,
    marginTop: 8,
    marginBottom: 0
  },
  titleImage: {
    width: 25,
    height: 25,
    backgroundColor: '#000',
    borderRadius: 12.5,
    marginLeft: 0
  },
  titleTextColumn: {
    flex: 2,
    width: cardWidth - 40 - 10 - 16 - 100,
    flexDirection: 'column',
    height: 26,
    marginLeft: 5
  },
  titleText: {
    width: cardWidth - 40 - 10 - 16,
    color: '#282929',
    fontSize: 12
  },
  subTitleText: {
    fontSize: 9,
    color: '#282929'
  },

  body: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 5,
    paddingTop: 5,
    fontSize: 20
  },
  titleText: {
    fontSize: 24,
    color: '#fff',
  },
  descriptionText: {
    color: '#777',
    fontSize: 12
  },
  dateText: {
    flexDirection: 'column',
    width: 60,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dayText: {
    fontSize: 28,
  },
  monthText: {
    color: '#2cb673',
  },

  postImage: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',

  },
  postImageCountText: {
    marginTop: 5,
    marginRight: 10,
    backgroundColor: 'rgba(0,0,0,0)',
    color: '#eee',
    fontSize: 17
  },

  postActionsRow: {
    height: 36,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  pointCountText: {
    color: '#757d83',
    fontSize: 15,
    marginRight: 10
  },
  commentCountText: {
    color: '#757d83',
    fontSize: 15,
    marginRight: 10
  },
  actionTouchable: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 36
  },
  actionIcon: {
    width: 20,
    height: 36
  }
});

module.exports = Event;
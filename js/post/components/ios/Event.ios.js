/**
 * Event.ios.js
 * kevin made this
 * i will never drink again
 */
 'use strict';

var React = require('react-native');
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
var FullEventBody = require('./FullEventBody.ios.js');

var _ = require('underscore');
var constants = require('./../../../constants');
var routes = require('./../../../routes');
var timeAgo = require('./../../../shared/helpers/timeAgo');
var PostActions = require('./../../../post/PostActions');
var PostStore = require('./../../../post/PostStore');
var POST = constants.POST;

var Event = React.createClass({
  propTypes: {
    mainRoute: React.PropTypes.object,
    mainNavigator: React.PropTypes.object.isRequired,
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
      collapsed: true,
      date: new Date(this.props.post.event.date)
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

  getMonthText() {
    var monthNum = this.state.date.getMonth();
    var monthMap = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];
    return monthMap[monthNum];
  },
  getWeekdayText() {
    var weekdayNum = this.state.date.getDay();
    var weekdayMap = [
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat'
    ];
    return weekdayMap[weekdayNum];
  },
  getHoursText() {
    var hours = this.state.date.getHours();
    if(hours == 0) return '12'; // 12 AM
    if(hours > 11) return hours - 12 + 1; // sometime in the PM
    else return hours - 1; // sometime in the AM
  },
  getMinutesText() {
    var minutes = String(this.state.date.getMinutes());
    if(minutes.length < 2) minutes = '0' + minutes;
    return minutes;
  },
  getAMorPM() {
    var hours = this.state.date.getHours();
    if(hours < 11) return 'AM';
    if(hours == 23) return 'AM' // 12 AM
    else return 'PM';
  },

  _renderPostTitle() {
    var date = new Date(this.state.post.event.date);
    if(_.isEmpty(this.state.post.title)) return null;
    return (
      <View style={styles.body}>

        <View style={styles.dateText}>
          <Text style={styles.dayText}>
            { this.getMonthText() }
          </Text>
          <Text style={styles.monthText}>
            { this.state.date.getDate() }
          </Text>
        </View>

        <View style={styles.titleTextColumn}>
          <Text style={styles.bodyText}>
            { this.state.post.title }
          </Text>
          {/*<Text style={styles.descriptionText}>
            { this.state.post.event.description }
          </Text>*/}
        </View>

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
    var imageURL = (_.isEmpty(this.state.post.images[0]) || this.state.post.images[0] == '/img/default_event_img.png')? 'http://api.joinbevy.com/img/default_event_img.png' : this.state.post.images[0];
    return (
      <View style={{borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
        <Image
          style={ styles.postImage }
          source={{ uri: imageURL }}
          resizeMode='cover'
        >
          <View style={{flex: 2, backgroundColor: 'rgba(0,0,0,.2)', width: constants.width}}/>
        </Image>
      </View>
    );
  },

  render() {
    var post = this.state.post;

    var body = (this.props.inCommentView)
    ? <FullEventBody
        mainRoute={this.props.mainRoute}
        mainNavigator={this.props.mainNavigator}
        inCommentView={this.props.inCommentView}
        post={this.state.post}
      />
    : <TouchableHighlight
        underlayColor='rgba(0,0,0,.1)'
        onPress={() => {
          // go to comment view
          // return if we're already in comment view
          if(this.props.inCommentView) return;

          var commentRoute = routes.MAIN.COMMENT;
          commentRoute.postID = this.state.post._id;
          this.props.mainNavigator.push(commentRoute);
        }}
      >
        <View style={ styles.eventCard}>
          { this._renderPostImage() }
          { this._renderPostTitle() }
        </View>
      </TouchableHighlight>;

    return (
      <View style={[styles.postCard, {marginTop: (this.props.inCommentView) ? 10 : 0}]}>
        <View style={styles.titleRow}>
          <Image
            style={styles.titleImage}
            source={{ uri: post.author.image_url }}
          />
          <View style={styles.titleTextColumn}>
            <Text numberOfLines={ 1 } style={styles.titleText}>
              { post.author.displayName } • { post.bevy.name }
            </Text>
            <Text style={styles.subTitleText}>
              { timeAgo(Date.parse(post.created)) }
            </Text>
          </View>
        </View>
        {body}
        <View style={styles.postActionsRow}>
          <TouchableHighlight
            underlayColor='rgba(0,0,0,0.1)'
            style={[ styles.actionTouchable, { flex: 2 } ]}
            onPress={() => {
                if(this.props.loggedIn) {
                  PostActions.vote(post._id);
                  this.setState({
                    voted: !this.state.voted
                  });
                } else {
                  this.props.authModalActions.open('Log In To Post');
                }
            }}
          >
            <View style={[ styles.actionTouchable, { flex: 1 } ]}>
              <Text style={ styles.pointCountText }>
                { this.countVotes() }
              </Text>
              <Icon
                name={ (this.state.voted) ? 'ios-heart' : 'ios-heart-outline' }
                size={20}
                color='#2cb673'
                style={styles.actionIcon}
              />
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor='rgba(0,0,0,0.1)'
            style={[ styles.actionTouchable, { flex: 2 } ]}
            onPress={() => {
              // go to comment view
              // return if we're already in comment view
              if(this.props.inCommentView) return;

              var commentRoute = routes.MAIN.COMMENT;
              commentRoute.postID = this.state.post._id;
              this.props.mainNavigator.push(commentRoute);
            }}
          >
            <View style={[ styles.actionTouchable, { flex: 1 } ]}>
              <Text style={ styles.commentCountText }>
                { post.comments.length }
              </Text>
              <Icon
                name='ios-chatbubble'
                size={20}
                color='rgba(0,0,0,.3)'
                style={styles.actionIcon}
              />
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor='rgba(0,0,0,0.1)'
            style={[ styles.actionTouchable, { flex: 1 } ]}
            onPress={() => {
              this.setState({
                collapsed: !this.state.collapsed
              })
            }}
          >
            <Icon
              name='ios-more'
              size={20}
              color='#757d83'
              style={styles.actionIcon}
            />
          </TouchableHighlight>
        </View>
        <Collapsible collapsed={this.state.collapsed} >
          <PostActionList post={ this.state.post } { ...this.props } user={this.props.user} />
        </Collapsible>
      </View>
    );
  }

});

var sideMargins = 10;
var cardWidth = constants.width - sideMargins * 2;

var styles = StyleSheet.create({
  postCard: {
    flexDirection: 'column',
    width: cardWidth,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: sideMargins,
    marginRight: sideMargins,
    paddingTop: 0,
    backgroundColor: 'white',
    borderRadius: 2,
  },

  eventCard: {
    margin: 5,
    borderWidth: 0,
    borderColor: 'rgba(0,0,0,.1)',
    borderRadius: 5,
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
    marginVertical: 5
  },
  titleImage: {
    width: 30,
    height: 30,
    backgroundColor: '#000',
    borderRadius: 15,
    marginLeft: 0
  },
  titleTextColumn: {
    flex: 1,
    width: cardWidth - 40 - 10 - 16,
    flexDirection: 'column',
    justifyContent: 'center',
    height: 26,
    marginLeft: 10,
    backgroundColor: 'rgba(0,0,0,0)'
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
    flexDirection: 'row',
    marginBottom: 5,
    paddingTop: 5
  },
  bodyText: {
    fontSize: 18,
    color: '#393939',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0)'
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
    fontSize: 20,
  },
  monthText: {
    color: '#2cb673',
    fontSize: 16
  },

  postImage: {
    height: 65,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',

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
    height: 20
  }
});

module.exports = Event;

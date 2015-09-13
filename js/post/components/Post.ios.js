/**
 * Post.ios.js
 * kevin made this
 * yo that party was tight
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
var {
  Icon
} = require('react-native-icons');
var ImageOverlay = require('./ImageOverlay.ios.js');
var Accordion = require('react-native-accordion');
var PostActionList = require('./PostActionList.ios.js')

var constants = require('./../../constants');
var POST = constants.POST;
var routes = require('./../../routes');
var timeAgo = require('./../../shared/helpers/timeAgo');
var PostActions = require('./../PostActions');
var PostStore = require('./../PostStore');

var Post = React.createClass({
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
      voted: this.props.post.voted
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
    if(_.isEmpty(this.state.post.title)) return null;
    return (
      <View style={styles.body}>
        <Text style={styles.bodyText}>
          { this.state.post.title }
        </Text>
      </View>
    );
  },

  _renderImageOverlay() {
    if(this.state.post.images.length <= 0) return null;
    return (
      <ImageOverlay 
        images={ this.state.post.images }
        isVisible={ this.state.overlayVisible } 
      />
    );
  },

  _renderPostImage() {
    if(_.isEmpty(this.state.post.images)) {
      return <View />;
    }
    var imageCount = this.state.post.images.length;
    var imageCountText = (imageCount > 1) 
    ? (
      <Text style={ styles.postImageCountText }>
        + { imageCount - 1 } more
      </Text>
    )
    : null;

    return (
      <TouchableHighlight
        underlayColor='rgba(0,0,0,0.1)'
        onPress={() => {
          this.setState({
            overlayVisible: true
          });
        }}
      >
        <Image
          style={ styles.postImage }
          source={{ uri: this.state.post.images[0] }}
          resizeMode='cover'
        >
          { imageCountText }
        </Image>
      </TouchableHighlight>
    );
  },

  render: function() {
    var post = this.state.post;

    return (
      <View style={styles.postCard}>
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
        
        { this._renderPostTitle() }

        { this._renderImageOverlay() }

        { this._renderPostImage() }

        <Accordion
          ref={ (accordion) => this.optionsAccordion = accordion }
          animationDuration={ 200 }
          header={
            <View style={styles.postActionsRow}>
              <TouchableHighlight 
                underlayColor='rgba(0,0,0,0.1)'
                style={[ styles.actionTouchable, { flex: 2 } ]}
                onPress={() => {
                  PostActions.vote(post._id);
                  this.setState({
                    voted: !this.state.voted
                  });
                }}
              >
                <View style={[ styles.actionTouchable, { flex: 1 } ]}>
                  <Text style={ styles.pointCountText }>
                    { this.countVotes() }
                  </Text>
                  <Icon
                    name={ (this.state.voted) ? 'fontawesome|thumbs-up' : 'fontawesome|thumbs-o-up' }
                    size={20}
                    color='#757d83'
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
                    name='fontawesome|comment-o'
                    size={20}
                    color='#757d83'
                    style={styles.actionIcon}
                  />
                </View>
              </TouchableHighlight>
              <TouchableHighlight 
                underlayColor='rgba(0,0,0,0.1)'
                style={[ styles.actionTouchable, { flex: 1 } ]}
                onPress={() => {
                  this.optionsAccordion.toggle();
                }}
              >
                <Icon
                  name='fontawesome|ellipsis-v'
                  size={20}
                  color='#757d83'
                  style={styles.actionIcon}
                />
              </TouchableHighlight>
            </View>
          }
          content={ <PostActionList post={ this.state.post } { ...this.props } /> }
        />
        
      </View>
    );
  },
});

var sideMargins = 10;
var cardWidth = constants.width - sideMargins * 2;

var styles = StyleSheet.create({
  postCard: {
    flexDirection: 'column',
    width: cardWidth,
    marginTop: 10,
    marginLeft: sideMargins,
    marginRight: sideMargins,
    paddingTop: 8,
    backgroundColor: 'white',
    borderRadius: 2,
    shadowColor: 'black',
    shadowRadius: 1,
    shadowOpacity: .3,
    shadowOffset:  {width: 0, height: 0}
  },
  titleRow: {
    flexDirection: 'row',
    width: cardWidth,
    paddingLeft: 8,
    paddingRight: 8,
    marginBottom: 10
  },
  titleImage: {
    width: 40,
    height: 40,
    backgroundColor: 'black',
    borderRadius: 20,
  },
  titleTextColumn: {
    flex: 1,
    width: cardWidth - 40 - 10 - 16,
    flexDirection: 'column',
    justifyContent: 'center',
    height: 40,
    marginLeft: 10
  },
  titleText: {
    width: cardWidth - 40 - 10 - 16,
    color: '#282929'
  },
  subTitleText: {
    fontSize: 10,
    color: '#282929'
  },

  body: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 15,
    paddingLeft: 15,
    paddingRight: 15
  },
  bodyText: {
    fontSize: 13,
    color: '#282929'
  },

  postImage: {
    height: 75,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end'
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

module.exports = Post;
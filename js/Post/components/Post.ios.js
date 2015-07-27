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
var Modal = require('react-native-modal');

var constants = require('./../../constants');
var timeAgo = require('./../../shared/helpers/timeAgo');

var Post = React.createClass({
  propTypes: {
    post: React.PropTypes.object
  },

  getInitialState() {
    return {
      overlayVisible: false
    };
  },

  countVotes: function() {
    var sum = 0;
    this.props.post.votes.forEach(function(vote) {
      sum += vote.score;
    });
    return sum;
  },

  _renderPostTitle() {
    if(_.isEmpty(this.props.post.title)) return null;
    return (
      <View style={styles.body}>
        <Text style={styles.bodyText}>
          { this.props.post.title }
        </Text>
      </View>
    );
  },

  _renderImageOverlay() {
    if(this.props.post.images.length <= 0) return null;
    return (
      <ImageOverlay 
        images={ this.props.post.images }
        isVisible={ this.state.overlayVisible } 
      />
    );
  },

  _renderPostImage() {
    if(_.isEmpty(this.props.post.images)) {
      return <View />;
    }
    var imageCount = this.props.post.images.length;
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
          source={{ uri: this.props.post.images[0] }}
          resizeMode='cover'
        >
          { imageCountText }
        </Image>
      </TouchableHighlight>
    );
  },

  render: function() {
    var post = this.props.post || {};

    return (
      <View style={styles.postCard}>
        <View style={styles.titleRow}>
          <Image 
            style={styles.titleImage}
            source={{ uri: post.author.image_url }}
          />
          <View style={styles.titleTextColumn}>
            <Text style={styles.titleText}>
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

        <View style={styles.postActionsRow}>
          <TouchableHighlight 
            underlayColor='rgba(0,0,0,0.1)'
            style={[ styles.actionTouchable, { flex: 2 } ]}
          >
            <View style={[ styles.actionTouchable, { flex: 1 } ]}>
              <Text style={ styles.pointCountText }>
                { this.countVotes() }
              </Text>
              <Icon
                name='fontawesome|thumbs-o-up'
                size={20}
                color='#757d83'
                style={styles.actionIcon}
              />
            </View>
          </TouchableHighlight>
          <TouchableHighlight 
            underlayColor='rgba(0,0,0,0.1)'
            style={[ styles.actionTouchable, { flex: 2 } ]}
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
          >
            <Icon
              name='fontawesome|ellipsis-v'
              size={20}
              color='#757d83'
              style={styles.actionIcon}
            />
          </TouchableHighlight>
        </View>
      </View>
    );
  },
});

var styles = StyleSheet.create({
  postCard: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
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
    flexDirection: 'column',
    justifyContent: 'center',
    height: 40,
    marginLeft: 10
  },
  titleText: {
    color: '#282929'
  },
  subTitleText: {
    fontSize: 10,
    color: '#282929'
  },

  body: {
    flexDirection: 'column',
    marginBottom: 15,
    paddingLeft: 8,
    paddingRight: 8
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
  },
});

module.exports = Post;